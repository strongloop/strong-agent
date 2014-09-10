'use strict';

process.env.SL_ENV = 'dev';

var agent = require('../');
var assert = require('assert');
var http = require('http');
var json = require('../lib/json');
var url = require('url');

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

var proxy = http.createServer(function(req_, res_) {
  var u = url.parse(req_.url);
  assert.equal(req_.headers['proxy-authorization'],
               'Basic ' + Buffer('user:pass').toString('base64'));
  assert.equal(u.protocol, 'http:');
  var req = http.request({
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
  agent.profile('some app', 'some key', {
    proxy: 'http://user:pass@127.0.0.1:' + proxy.address().port + '/',
    endpoint: {
      host: server.address().address,
      port: server.address().port,
      secure: false,  // Default: true
    },
  });

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
