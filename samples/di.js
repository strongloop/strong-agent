// Copyright (c) 2014, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

var assert = require('assert');
var json = require('../lib/json');
var net = require('net');
var path = require('path');

// This is the instrumentation that we are going to inject into the other
// process.  It measures request/response times and sends off the metrics
// to a server in this process.
//
// Note that instrumentation only has access to what is visible in the
// lexical scope at the point of insertion: locals, globals and captured
// (i.e. referenced) variables from enclosing scopes.  Variables from outer
// scopes that are not referenced in the original function are not visible
// to instrumentation; trying to inject code that references them will fail.
var instrumentation = (function() {
  (function(agent, req, res) {
    var socket = global.__DYNINST_SOCKET;
    if (socket == null) {
      socket = agent.require('dgram').createSocket('udp4');
      socket.unref();
      Object.defineProperty(global, '__DYNINST_SOCKET', { value: socket });
    }
    /* Keep references to the metrics we want to capture, they may have changed
     * or gone away by the time we send off the datagram. */
    var host = req.socket.remoteAddress;
    var port = req.socket.remotePort;
    var path = req.url;
    var time = process.hrtime();
    res.once('finish', function() {
      time = process.hrtime(time);
      var message = Buffer(JSON.stringify({
        time: time[0] + time[1] / 1e6,
        host: host,
        port: port,
        path: path,
      }));
      socket.send(message, 0, message.length, $PORT, '127.0.0.1');
    });
  })(STRONGAGENT, req, res);
}).toString().slice(14, -2);

// TODO(bnoordhuis) Could be minified further using e.g. uglifyjs.
instrumentation = instrumentation.trim().replace(/\s+/g, ' ');

// This is the server that receives the metrics.
var server = require('dgram').createSocket('udp4');
server.on('message', function(message) {
  message = JSON.parse('' + message);
  console.log('%s %d %j %d',
              message.host,
              message.port,
              message.path,
              message.time);
});
server.bind(0);

net.connect(7000).once('connect', function() {
  var socket = this;
  var reader = json.JsonDecoder();
  var writer = json.JsonEncoder();
  socket.pipe(reader);
  writer.pipe(socket);
  step0();

  // First find all the scripts.
  function step0() {
    writer.write({ cmd: 'scripts', version: 0 });
    reader.once('data', step1);
  }

  // Now find the script that we want to patch, app.js.
  function step1(scripts) {
    assert.equal(Array.isArray(scripts), true);
    assert.equal(scripts.length % 2, 0);
    var scriptname = path.join(__dirname, 'app.js');
    var scriptid = -1;
    for (var i = 0, n = scripts.length; i < n; i += 2) {
      if (scriptname !== scripts[i + 1]) continue;
      scriptid = scripts[i + 0];
      break;
    }
    if (scriptid === -1) {
      throw Error('No script for ' + scriptname);
    }
    writer.write({ cmd: 'sources', scriptids: [scriptid], version: 0 });
    reader.once('data', step2.bind(null, scriptid));
  }

  // Find the position in the source where we want to inject our code.
  function step2(scriptid, sources) {
    var source = sources[0];
    var eols = sources[1];
    var pos = source.indexOf('function onrequest');
    var eol = eols.filter(function(npos) { return pos < npos })[0];
    var change = instrumentation.replace(/\$PORT/g, server.address().port);
    if (change === source.slice(eol - change.length, eol)) {
      console.log('Already instrumented.');
      return done();
    }
    var changes = [eol, change];
    writer.write({ cmd: 'patch', changes: changes,
                   scriptid: scriptid, version: 0 });
    reader.once('data', step3);
  }

  // Check that the patch applied.
  function step3(result) {
    if (result.error) {
      var err = new Error(result.error);
      err.stack = result.stack;  // Error stack from other process.
      throw err;
    }
    var changelog = result.changelog;
    for (var i = 0, n = changelog.length; i < n; i += 1) {
      if (changelog[i].function_patched === 'onrequest') {
        console.log('Instrumented.  Now start making requests.');
        return done();
      }
    }
    console.error('Instrumentation FAILED:', result);
    done();
  }

  function done() {
    socket.destroy();
  }
});
