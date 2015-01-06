'use strict';

process.env.SL_ENV = 'dev';
var config = require('../lib/config');
config.baseInterval = 250;

var agent = require('..');
var assert = require('assert');
var http = require('http');
var json = require('../lib/json');

var events = [];

http.createServer(
         function(req, res) {
           req.pipe(json.JsonDecoder()).once('data', function(data) {
             console.log(data);
             assert.equal(data.key, 'some key');
             assert.equal(data.pid, process.pid);
             this.on('data', events.push.bind(events));
             // Delay sending back the handshake ack.
             setTimeout(function() {
               var encoder = json.JsonEncoder();
               encoder.write({sessionId: 'deadbeef'});
               encoder.pipe(res);
             }, 250);
           });
           this.close();
         }).listen(0, '127.0.0.1', function() {
  agent.profile('some key', 'some app', {
    endpoint: {
      host: this.address().address,
      port: this.address().port,
      secure: false,
    },
  });
  agent.transport.onhandshakedone = function(handshake) {
    console.log(events);
    assert.equal(handshake.sessionId, 'deadbeef');
    assert.equal(events.length, 0);
    setTimeout(function() {
      assert(events.length > 0);
      agent.stop();
    }, 250);
  };
});
