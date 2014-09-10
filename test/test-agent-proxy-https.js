'use strict';

process.env.SL_ENV = 'dev';

var agent = require('../');
var assert = require('assert');
var http = require('http');
var https = require('https');
var json = require('../lib/json');
var path = require('path');
var url = require('url');

var cert =
    "-----BEGIN CERTIFICATE-----\n" +
    "MIIB3jCCAWgCAihtMA0GCSqGSIb3DQEBBQUAMH0xCzAJBgNVBAYTAlVTMQswCQYD\n" +
    "VQQIEwJDQTEWMBQGA1UEBxMNU2FuIEZyYW5jaXNjbzEZMBcGA1UEChMQU3Ryb25n\n" +
    "TG9vcCwgSW5jLjESMBAGA1UECxMJU3Ryb25nT3BzMRowGAYDVQQDExFjYS5zdHJv\n" +
    "bmdsb29wLmNvbTAgFw0xNDAzMjUxMzA2MjhaGA8yMTAzMTIxMjEzMDYyOFowGTEX\n" +
    "MBUGA1UEAxMOc3Ryb25nbG9vcC5jb20wfDANBgkqhkiG9w0BAQEFAANrADBoAmEA\n" +
    "2yoX47wnC+WFNXysiAsiFTx9u/cZdXIH1S8TWU3eNpHDee/mZlZ3fxpLM7rnEfpN\n" +
    "TeOxllCdEMJK6vdJbkwGXS0JCuQ2Kbirc18u0KWiEN8fZk9SUajL6iSU+R+5suFb\n" +
    "AgMBAAGjGTAXMBUGA1UdEQQOMAyHBAAAAACHBH8AAAEwDQYJKoZIhvcNAQEFBQAD\n" +
    "YQDV2AAyyRN/FK2ENRWeCnruzvN+ENKDSJrXUzBCkQpN2pNeO+LVd4gIYkHicjf+\n" +
    "WJY59HEmZXxRQB/NdWsF/gBZ2LuLKHn9VJKnVxVCWhioQAvqgx899hV/ituI6AQF\n" +
    "rME=\n" + "-----END CERTIFICATE-----\n";

var key = "-----BEGIN RSA PRIVATE KEY-----\n" +
          "MIIBygIBAAJhANsqF+O8JwvlhTV8rIgLIhU8fbv3GXVyB9UvE1lN3jaRw3nv5mZW\n" +
          "d38aSzO65xH6TU3jsZZQnRDCSur3SW5MBl0tCQrkNim4q3NfLtClohDfH2ZPUlGo\n" +
          "y+oklPkfubLhWwIDAQABAmEAqC4GBRFWWU+4yBGzB/abIfa4eawl0jU+A37Ld0VE\n" +
          "11VFzuWkRTXnHxcbTEgJl4cdrPTbFKsSB3eB+E4idpFAYaZrtHnntvx5uHQDPsh7\n" +
          "p0+L+FYtXSSVu1UMBDWnU9fRAjEA/J8rhz2sQTekdyn50Vr0KtC8vLv3QDjrt1VX\n" +
          "M4Hsk60rJm2dJqbwKnpwT3usL8E5AjEA3hhihTNP2GLM78CHvbRstD4QhPZQNGSJ\n" +
          "jY30SfggxlpcLNpk88bm/mZGzXAiIXszAjBh7GE3H1TyQtthxcesu5ECN7+xeTsy\n" +
          "jd3xRwdyU96cr/eWAc90+CkIjkWSyeHI8SECMEfQLLMTR2MZd1iisYGWwHt7gg3s\n" +
          "MzztsUiTOQVd9QMOHrXmHDRzASgLXCN7eZ3H3wIwb2UeDWwyRyJAYLRlJQhbpg6y\n" +
          "qdXEKtWB7iMjoNFX1wG1mp1r9aWdkIU2Tm6KHZnD\n" +
          "-----END RSA PRIVATE KEY-----\n";

var ca = [
  "-----BEGIN CERTIFICATE-----\n" +
      "MIIB3jCCAWgCAihtMA0GCSqGSIb3DQEBBQUAMH0xCzAJBgNVBAYTAlVTMQswCQYD\n" +
      "VQQIEwJDQTEWMBQGA1UEBxMNU2FuIEZyYW5jaXNjbzEZMBcGA1UEChMQU3Ryb25n\n" +
      "TG9vcCwgSW5jLjESMBAGA1UECxMJU3Ryb25nT3BzMRowGAYDVQQDExFjYS5zdHJv\n" +
      "bmdsb29wLmNvbTAgFw0xNDAzMjUxMzA2MjhaGA8yMTAzMTIxMjEzMDYyOFowGTEX\n" +
      "MBUGA1UEAxMOc3Ryb25nbG9vcC5jb20wfDANBgkqhkiG9w0BAQEFAANrADBoAmEA\n" +
      "2yoX47wnC+WFNXysiAsiFTx9u/cZdXIH1S8TWU3eNpHDee/mZlZ3fxpLM7rnEfpN\n" +
      "TeOxllCdEMJK6vdJbkwGXS0JCuQ2Kbirc18u0KWiEN8fZk9SUajL6iSU+R+5suFb\n" +
      "AgMBAAGjGTAXMBUGA1UdEQQOMAyHBAAAAACHBH8AAAEwDQYJKoZIhvcNAQEFBQAD\n" +
      "YQDV2AAyyRN/FK2ENRWeCnruzvN+ENKDSJrXUzBCkQpN2pNeO+LVd4gIYkHicjf+\n" +
      "WJY59HEmZXxRQB/NdWsF/gBZ2LuLKHn9VJKnVxVCWhioQAvqgx899hV/ituI6AQF\n" +
      "rME=\n" + "-----END CERTIFICATE-----\n",
  "-----BEGIN CERTIFICATE-----\n" +
      "MIICJzCCAbECAho7MA0GCSqGSIb3DQEBBQUAMH0xCzAJBgNVBAYTAlVTMQswCQYD\n" +
      "VQQIEwJDQTEWMBQGA1UEBxMNU2FuIEZyYW5jaXNjbzEZMBcGA1UEChMQU3Ryb25n\n" +
      "TG9vcCwgSW5jLjESMBAGA1UECxMJU3Ryb25nT3BzMRowGAYDVQQDExFjYS5zdHJv\n" +
      "bmdsb29wLmNvbTAgFw0xNDAzMjUxMzA2MjhaGA8yMTAzMTIxMjEzMDYyOFowfTEL\n" +
      "MAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1TYW4gRnJhbmNpc2Nv\n" +
      "MRkwFwYDVQQKExBTdHJvbmdMb29wLCBJbmMuMRIwEAYDVQQLEwlTdHJvbmdPcHMx\n" +
      "GjAYBgNVBAMTEWNhLnN0cm9uZ2xvb3AuY29tMHwwDQYJKoZIhvcNAQEBBQADawAw\n" +
      "aAJhAPcmLFdCHyLcMAOWibzFbcWkVDuarC8I1FdsnU0cWB/q0JzDBFlw5sVAvGu6\n" +
      "PMom7IP93yWgA/tohVBVCY36cU1f992JLshbLTxp9AXHZtuE0yEx5wN+EksEovc4\n" +
      "S0vKZQIDAQABMA0GCSqGSIb3DQEBBQUAA2EAClNWLwytvmxPrbu8nhMT6G1xFyjE\n" +
      "5kmAjjgFrxCAasHs56VKZg7ipHsj4gUclgayJrVY+5J5BVwjFZvhQchbFyer4k/r\n" +
      "DeZDm43Wvg5mMOZuyjCfC4S1OV8nCyMhuw1x\n" + "-----END CERTIFICATE-----\n"
];

// Proxy certificate is signed by a self-signed CA.
var proxyOptions = {
  ciphers: '-ALL:RC4-SHA',
  honorCipherOrder: true,
  cert: cert,
  key: key,
  ca: ca,
};

var server = http.createServer(function(req, res) {
  assert.equal(req.url, '/agent/v1');
  assert.equal(req.method, 'POST');
  assert.equal(req.headers['content-type'], 'application/json');
  var encoder = json.JsonEncoder();
  encoder.pipe(res);
  req.pipe(json.JsonDecoder()).once('data', function(data) {
    assert.equal(data.pid, process.pid);
    encoder.write({sessionId: 'deadbeef'});  // Handshake.
    this.on('data', function(data) {
      if (data.cmd === 'ping') {
        encoder.end({cmd: 'pong', args: data.args});
      }
    });
  });
});

var proxy = https.createServer(proxyOptions, function(req_, res_) {
  assert.equal(req_.socket.getCipher().name, 'RC4-SHA');
  var u = url.parse(req_.url);
  var proto = u.protocol === 'https:' ? https : http;
  var req = proto.request({
    agent: false,
    host: u.hostname,
    port: u.port,
    path: u.path,
    method: req_.method,
    headers: req_.headers,
  });
  req.once('response', function(res) { res.pipe(res_); });
  req_.pipe(req);
});

server.listen(0, '127.0.0.1',
              function() { proxy.listen(0, '127.0.0.1', start); });

function start() {
  // lib/agent.js looks for package.json in process.cwd().
  process.chdir(__dirname);

  var filename = path.resolve(__dirname, './strongloop.json');
  require(filename);
  require.cache[filename].exports = {
    appName: 'some app',
    userKey: 'some key',
    proxy: {
      host: proxy.address().address,
      port: proxy.address().port,
      ca: proxyOptions.ca,
    },
    endpoint: url.format({
      protocol: 'http',
      hostname: server.address().address,
      port: server.address().port,
    }),
  };

  // Agent should load config from our patched strongloop.json.
  agent.profile();
  agent.internal.on('pong', function(data) {
    assert.equal(data, 42);
    agent.stop();
    pongs += 1;
    proxy.close();
    server.close();
  });
  agent.internal.send('ping', 42);

  var pongs = 0;
  process.on('exit', function() { assert.equal(pongs, 1); });
}
