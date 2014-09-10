'use strict';

var certs = require('./certs');
var events = require('events');
var http = require('http');
var https = require('https');
var json = require('./json');
var url = require('url');
var util = require('util');

module.exports = Transport;

// TODO(bnoordhuis,rmg) Make fingerprint configurable through lib/certs.js in
// order to suppress the error message during testing?  Requires a rewrite
// of the fingerprint check regression tests.
var fingerprints = {
  prod: '02:64:24:CC:40:B5:52:EB:46:62:CE:D8:0B:E2:1C:76:25:6D:21:C2',
  dev: '2C:10:D9:6B:9C:8C:89:C1:87:E8:89:03:68:7D:39:B4:2F:52:9E:42',
};
var expectedFingerprint = fingerprints[process.env.SL_ENV] || fingerprints.prod;

// Parse a proxy or endpoint configuration string or object.  When a string,
// it's a URL that look like 'proto://domain:port', where |proto| is one of
// 'http', 'https' or 'https+noauth'.
//
// +noauth disables certificate validation, something that may be necessary
// for corporate proxies that use a self-signed certificate or a certificate
// that is signed by a self-signed CA.
//
// When the input is an object, it looks like this:
//
//    {
//      "host": "example.com",        // Host name.  Semi-optional, see below.
//      "port": 4242,                 // Port number.  Optional.
//      "secure": true,               // Use HTTPS.  Default: true.
//      "rejectUnauthorized": true,   // Verify server cert.  Default: true.
//      "ca": ["...", /* "..." */],   // Chain of CAs.  Optional.
//    }
//
// * The host name is optional for the endpoint configuration (default:
//   'collector.strongloop.com') but obviously mandatory for the proxy
//   configuration.
//
// * The port number defaults to 443 if secure or 80 if !secure.
//
// * The chain of CA certificates should be an array of strings, must preserve
//   newlines and be in reverse order (i.e. the server certificate should come
//   before the first CA.)  Example:
//
//   {
//     "ca": [
//       // server certificate
//       "-----BEGIN CERTIFICATE-----\n" +
//       "MIIDJjCCAg4CAlgOMA0GCSqGSIb3DQEBBQUAMH0xCzAJBgNVBAYTAlVTMQswCQYD\n" +
//       "VQQIEwJDQTEWMBQGA1UEBxMNU2FuIEZyYW5jaXNjbzEZMBcGA1UEChMQU3Ryb25n\n" +
//       "...\n" +
//       "-----END CERTIFICATE-----",
//
//       // first CA certificate
//       "-----BEGIN CERTIFICATE-----\n" +
//       "VQQIEwJDQTEWMBQGA1UEBxMNU2FuIEZyYW5jaXNjbzEZMBcGA1UEChMQU3Ryb25n\n" +
//       "MIIDbzCCAlcCAknbMA0GCSqGSIb3DQEBBQUAMH0xCzAJBgNVBAYTAlVTMQswCQYD\n" +
//       "...\n" +
//       "-----END CERTIFICATE-----" ]
//   }
function parse(input) {
  if (typeof(input) === 'string') {
    var u = url.parse(input);
    return {
      auth: u.auth,
      host: u.hostname,
      port: u.port,
      secure: /^https/.test(u.protocol),
      rejectUnauthorized: /^https:$/.test(u.protocol),
    };
  }

  if (input && typeof(input) === 'object') {
    var result = Object.create(input);
    result.secure = typeof(result.secure) === 'undefined' || !!result.secure;
    result.rejectUnauthorized =
        typeof(result.rejectUnauthorized) === 'undefined' ||
        !!result.rejectUnauthorized;
    return result;
  }

  return null;
}

function encode(options) {
  if (!options) {
    return null;
  }

  var protocol = options.secure ? 'https' : 'http';

  if (!options.rejectUnauthorized && options.secure) {
    protocol += '+noauth';
  }

  var auth = (options.auth || '').replace(
      /:.+$/, function(s) { return ':' + Array(s.length).join('*'); });
  if (auth) {
    auth += '@';
  }

  // url.format has no way of always adding the '//', so ...
  return util.format('%s://%s%s:%d', protocol, auth, options.host,
                     options.port);
}

function Transport(options) {
  // Create a prototype-less backing store for the EventEmitter object.
  // Avoids bringing down the process when a malicious collector sends
  // a '__proto__' event.  (Unlikely but defense in depth.)
  this._events = Object.create(null);

  this.constructor.call(this);
  this.setMaxListeners(Infinity);

  this.state = 'new';
  this.options = options;
  // FIXME(bnoordhuis) The decoder is recreated for each request to work around
  // a streams2 bug where core emits a 'write after end' error for something
  // that is outside our control.  No tracking bug: I don't have time to put
  // together a test case.
  this.decoder = null;
  // The encoder isn't affected by that but it follows the same pattern to
  // avoid having multiple call sites where a JsonEncoder object is created.
  this.encoder = null;
  this.request = null;
  this.response = null;
  this.sessionId = null;
  this.sendQueue = [];  // See the comment in Transport#send().
  var logger = options.logger || {};
  this.notice = logger.notice || console.log;
  this.info = logger.info || console.info;
  this.warn = logger.warn || console.error;

  this.endpoint = parse(options.endpoint) || {
    host: options.host,
    port: options.port,
    secure: true,
    rejectUnauthorized: true,
  };

  var collector = options.collector || {};
  var c = (this.endpoint.secure ? collector.https : collector.http) || {};
  this.endpoint.host = this.endpoint.host || c.host;
  this.endpoint.port = this.endpoint.port || c.port;

  this.proxy = parse(options.proxy);
}

Transport.prototype = Object.create(events.EventEmitter.prototype);

Transport.init = function(options) { return new Transport(options); };

Transport.prototype.send = function(message) {
  // When the transport was explicitly disconnected, do not queue.
  if (this.encoder === null) {
    return false;
  }
  if (this.state === 'connected') {
    return this.encoder.write(message);
  }
  // See https://github.com/joyent/node/issues/7451 - a streams2 bug that
  // forces us to queue events if we don't want to lose events between the
  // start of the handshake and its completion.
  //
  // Ideally, we'd just let the JsonEncoder stream buffer pending data but:
  //
  //  - we can't pause the stream without unpiping it first, but
  //
  //  - we can't unpipe it synchronously because then the handshake data
  //    isn't send (because streams2 only does that on the next tick), and
  //
  //  - we cannot add a nextTick() or onwrite callback because that introduces
  //    a race window between write() call and the callback.
  //
  // I have many harsh words for streams2 but this comment is long enough
  // as it is, I'll save them for a blog post or something...
  this.sendQueue.push(this.send.apply.bind(this.send, this, arguments));
  return false;
};

Transport.prototype.connect = function(err) {
  if (this.request !== null) {
    // XXX(bnoordhuis) I'm half convinced this should be an error.
    this.request.end();
    this.request = null;
    this.encoder = null;
  }

  if (this.response !== null) {
    this.response.destroy();
    this.response = null;
    this.decoder = null;
  }

  if (this.disconnected()) {
    return;
  }

  var host = this.endpoint.host;
  var port = this.endpoint.port;
  var path = '/agent/v1';
  var proto = this.endpoint.secure ? https : http;
  var headers = {'Content-Type': 'application/json'};
  var ca = this.endpoint.ca || certs.ca;
  // AES128-GCM-SHA256 is a TLS v1.2 cipher and only available when node is
  // linked against openssl 1.0.1 or newer.  Node.js v0.10 ships with openssl
  // 1.0.1e so we're good with most installs but distro-built binaries are
  // often linked against the system openssl and those can be as old as 0.9.8.
  // That's why we have AES256-SHA as a fallback but because it's a CBC cipher,
  // it's vulnerable to BEAST attacks.  I don't think we have a reasonable
  // alternative here because RC4 has known weaknesses too.  The best we can
  // probably do is *strongly* recommend that people upgrade.
  var ciphers = 'AES128-GCM-SHA256:AES256-SHA';
  var rejectUnauthorized = this.endpoint.rejectUnauthorized;

  if (this.proxy) {
    path = url.format({
      protocol: this.endpoint.secure ? 'https' : 'http',
      pathname: path,
      hostname: host,
      port: port,
    });
    host = this.proxy.host;
    port = this.proxy.port;
    proto = this.proxy.secure ? https : http;
    ca = this.proxy.ca;
    // Defaults to require('tls').DEFAULT_CIPHERS which is assumed to be sane.
    ciphers = this.proxy.ciphers || '';
    rejectUnauthorized = this.proxy.rejectUnauthorized;
    if (this.proxy.auth) {
      headers['Proxy-Authorization'] =
          'Basic ' + Buffer(this.proxy.auth).toString('base64');
    }
  }

  var options = {
    agent: false,
    host: host,
    port: port,
    path: path,
    method: 'POST',
    headers: headers,
  };

  if (proto === https) {
    if (ca) {
      options.ca = ca;
    }
    if (ciphers) {
      options.ciphers = ciphers;
    }
    options.rejectUnauthorized = !!rejectUnauthorized;
  }

  if (this.state === 'new') {
    var proxy = encode(this.proxy);
    this.notice('using collector %s%s', encode(this.endpoint),
                proxy ? util.format(' via proxy %s', proxy) : '');
  }
  this.request = proto.request(options, this.onresponse.bind(this));

  // Can't unref the socket until the connection has established, meaning
  // the agent keeps the event loop alive until the DNS lookup completes.
  // Maybe mitigate by caching the result of the DNS lookup?
  // See https://github.com/joyent/node/issues/7149.
  // See https://github.com/joyent/node/issues/7077.
  this.request.once('socket', function(socket) {
    socket = socket.socket || socket;
    socket.unref();
  });

  this.request.once('close', this.onclose.bind(this));
  this.request.once('error', this.onerror.bind(this));
  this.encoder = json.JsonEncoder();
  this.encoder.pipe(this.request);

  var handshake = {
    agentVersion: this.options.agentVersion,
    appName: this.options.agent.appName,
    hostname: this.options.agent.hostname,
    key: this.options.agent.key,
    pid: process.pid,
  };
  if (this.sessionId !== null) {
    handshake.sessionId = this.sessionId;
  }
  this.encoder.write(handshake);
};

Transport.prototype.disconnect = function() {
  if (this.request !== null) {
    this.request.end();
    this.request = null;
    this.encoder = null;
  }
  if (this.response !== null) {
    this.response.destroy();
    this.response = null;
    this.decoder = null;
  }
  this.state = 'disconnected';
};

Transport.prototype.disconnected =
    function() { return this.state === 'disconnected'; };

// for tests
Transport.reconnectDelay = 500;

Transport.prototype.onclose = function(err) {
  // TODO(bnoordhuis) Proper back-off.  This is workable for now though.
  setTimeout(this.connect.bind(this), Transport.reconnectDelay).unref();
};

Transport.prototype.onerror = function(err) {
  if (this.state === 'new' || this.state === 'disconnected') {
    this.warn('cannot connect to collector:', err.message);
    this.state = 'not-connected';
  } else if (this.state === 'connected') {
    this.warn('lost connection to collector:', err.message);
    this.state = 'lost-connection';
  }
};

Transport.prototype.ondecodererror = function(err) {
  var data = ('' + err.data).slice(0, 1024);
  data = data.replace(/[\t\r\n]/g, function(c) {
    return { '\t' : '\\t', '\r' : '\\r', '\n' : '\\n' }
    [c] || c;
  });
  data = data.replace(/[^\u0020-\u007F]/g, function(c) {
    return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
  });
  this.warn('transport error: %s (input: \'%s\')', err.message, data);
};

Transport.prototype.onresponse = function(response) {
  if (!this.proxy && response.socket.getPeerCertificate) {
    var actual = response.socket.getPeerCertificate().fingerprint;
    if (actual !== expectedFingerprint) {
      this.warn('SSL fingerprint mismatch! Expected %s, have %s.',
                expectedFingerprint, actual);
    }
  }

  if (this.proxy &&
      (response.statusCode === 401 || response.statusCode === 407)) {
    this.warn('%d proxy authentication error.  Bad username/password?',
              response.statusCode);
    return;  // We reconnect after close.
  }

  this.decoder = new json.JsonDecoder(-1);  // Unlimited, collector is trusted.
  this.decoder.on('error', this.ondecodererror.bind(this));
  this.decoder.once('data', this.onhandshake.bind(this));

  this.response = response;
  this.response.pipe(this.decoder);
};

Transport.prototype.onhandshake = function(handshake) {
  this.decoder.on('data', ondata.bind(this));
  this.sessionId = handshake.sessionId;

  if (this.state === 'not-connected' || this.state === 'new') {
    this.info('connected to collector');
  } else if (this.state === 'lost-connection') {
    this.info('reconnected to collector');
  }
  this.state = 'connected';

  // Deliver queued Transport#send() calls.
  this.sendQueue.splice(0, this.sendQueue.length).forEach(function(f) { f() });
  if (typeof(this.onhandshakedone) === 'function') {
    this.onhandshakedone(handshake);  // Picked up by tests.
  }
  return;

  function ondata(data) { this.emit('message', data); }
};
