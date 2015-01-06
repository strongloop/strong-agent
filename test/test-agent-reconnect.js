'use strict';

process.env.SL_ENV = 'test';

var assert = require('assert');
var url = require('url');

if (process.argv[2] === 'collector') {
  collector();
} else {
  agent();
}

function collector() {
  var http = require('http');
  var json = require('../lib/json');
  http.createServer(
           function(req, res) {
             assert.equal(req.url, '/agent/v1');
             res.write('{"sessionId":"DEADBEEF"}\n', function() {
               process.exit(42);  // Simulate abrupt collector shutdown.
             });
           }).listen(process.argv[3] | 0, '127.0.0.1', function() {
    process.stdout.write(url.format({
      protocol: 'http',
      hostname: this.address().address,
      port: this.address().port,
    }));
  });
}

var TRIES = 5;

function agent() {
  process.on('exit', function() {
    assert.equal(pummel.handshakes, TRIES);
    assert.equal(pummel.tries, TRIES);
  });
  pummel();
}

function pummel() {
  var agent = require('../');
  require('../lib/transport').reconnectDelay = 50;
  var spawn = require('child_process').spawn;
  var args = [__filename, 'collector', pummel.port | 0];
  var proc = spawn(process.execPath, args);
  proc.stderr.pipe(process.stderr);
  proc.stdout.setEncoding('utf8');
  proc.stdout.once('data', function(endpoint) {
    var u = url.parse(endpoint);
    if (pummel.port !== 0) {
      assert.equal(u.port | 0, pummel.port);
      return;
    }
    pummel.port = u.port | 0;
    var options = {
      endpoint: {
        host: u.hostname,
        port: u.port,
        secure: false,
      },
      quiet: true,
    };
    agent.profile('some key', ['some app', 'some host'], options);
    agent.transport.onhandshakedone = function() { pummel.handshakes += 1 };
  });
  proc.once('exit', function(exitCode) {
    assert.equal(exitCode, 42);
    if (++pummel.tries != TRIES) pummel();
  });
}
pummel.handshakes = 0;
pummel.tries = 0;
pummel.port = 0;
