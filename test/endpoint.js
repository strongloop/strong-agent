// agent transport endpoint, can be used during tests
//
// API:
//
// endpoint(callback):
//   returns an http server object
//   callback is on server's listening event
//
// event: 'handshake' on server object, value is a connection,
//   connection supports a single method: .send(), see Transport#send()
//   connection supports a single event: 'data', see lib/json.js 'data'
'use strict';

var assert = require('assert');
var debug = require('../lib/debug')('test');
var EventEmitter = require('events').EventEmitter;
var http = require('http');
var json = require('../lib/json');

function endpoint(callback) {
  var collector = http.createServer(function(req, res) {
    assert.equal(req.url, '/agent/v1');
    req.pipe(json.JsonDecoder()).once('data', onhandshake);
    return;

    function onhandshake(data) {
      var connection = new EventEmitter;
      var enc = json.JsonEncoder();
      enc.pipe(res);
      enc.write({ sessionId: 'deadbeef' });

      this.on('data', function(data) {
        debug('ondata:', data);
        connection.emit('data', data);
      });

      connection.send = function(cmd) {
        var args = [].slice.call(arguments, 1);
        enc.write({ cmd: cmd, args: args })
      };

      collector.emit('handshake', connection);
    }
  }).listen(0, '127.0.0.1', callback);

  return collector;
}

module.exports = endpoint;
