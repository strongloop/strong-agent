'use strict';

process.env.SL_ENV = 'test';

var agent = require('../');
var assert = require('assert');
var config = require('../lib/config');
var http = require('http');
var json = require('../lib/json');

var collected = 0;
process.on('exit', function() { assert.equal(collected, 1); });

function verifyDataIntegrity(data) {
  collected += 1;
  assert('tiers' in data);
  assert('http' in data.tiers);
  assert('mean' in data.tiers.http);
  assert.equal(typeof(data.tiers.http.mean), 'number');
}

// Do some cheating to speed up the test
config.baseInterval = 100;

var expressServer;

// Black hole
var collector = http.createServer(onrequest).listen(0, '127.0.0.1', onlisten);

function onrequest(req, res) {
 assert.equal(req.url, '/agent/v1');
 req.pipe(json.JsonDecoder()).once('data', onhandshake);
 return;

 function onhandshake(data) {
   assert.equal(data.pid, process.pid);
   assert.equal(data.key, 'some key');
   var enc = json.JsonEncoder();
   enc.pipe(res);
   enc.write({sessionId: 'deadbeef'});
   this.on('data', ondata);
 }

 function ondata(data) {
   if (data.cmd !== 'update' || !data.args[0].tiers ||
       !data.args[0].tiers.http) {
     return;
   }
   res.end();
   agent.stop();
   expressServer.close(function() {
     collector.close(function() { verifyDataIntegrity(data.args[0]) });
   });
 }
}

function onlisten() {
  // Start profiling
  agent.profile('some key', 'some app', {
    endpoint: {
      host: this.address().address,
      port: this.address().port,
      secure: false,
    },
    quiet: true,
  });

  // Start an express server and make a request to it
  var app = require('express')();
  app.get('/', function(req, res) { res.end('bar'); });

  // Wrap in http server so it can be closed properly
  expressServer = http.createServer(app);
  expressServer.listen(0, '127.0.0.1', function() {
    http.get({
      host: this.address().address,
      port: this.address().port,
      path: '/people',
    });
  });
}
