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
  assert('loopback_tiers' in data);
  assert('dao' in data.loopback_tiers);
  assert('mean' in data.loopback_tiers.dao);
  assert.equal(typeof(data.loopback_tiers.dao.mean), 'number');
}

// Do some cheating to speed up the test
config.tiersInterval = 100;

var loopbackServer;

// Black hole
var collector =
    http.createServer(
             function(req, res) {
               assert.equal(req.url, '/agent/v1');
               req.on('error', onerror);
               req.pipe(json.JsonDecoder()).once('data', onhandshake);
               return;

               function onerror(err) {
                 // Work around https://github.com/joyent/node/issues/5439, a
                 // streams2
                 // bug where core emits a 'stream.push() after EOF' error when
                 // two
                 // TCP packets arrive on the same tick and where response.end()
                 // is
                 // called after processing the first one but before the second
                 // one.
                 // As this is out of our control, all we can do is swallow the
                 // error.
                 if (err && /after EOF/.test(err.message)) {
                   return;
                 }
                 throw err;
               }

               function onhandshake(data) {
                 assert.equal(data.pid, process.pid);
                 assert.equal(data.key, 'some key');
                 var enc = json.JsonEncoder();
                 enc.pipe(res);
                 enc.write({sessionId: 'deadbeef'});
                 this.on('data', ondata);
               }

               function ondata(data) {
                 if (data.cmd !== 'update' || !data.args[0].loopback_tiers ||
                     !data.args[0].loopback_tiers.dao) {
                   return;
                 }
                 res.end();
                 agent.stop();
                 loopbackServer.close(function() {
                   collector.close(
                       function() { verifyDataIntegrity(data.args[0]) });
                 });
                 this.removeListener('data', ondata);
               }
             }).listen(0, '127.0.0.1', function() {
      // Start profiling
      agent.profile('some key', 'some app', {
        endpoint: {
          host: this.address().address,
          port: this.address().port,
          secure: false,
        },
        quiet: true,
      });

      var loopback = require('loopback');
      var db = loopback.createDataSource({connector: loopback.Memory});

      // Start an express server and make a request to it
      var Person = loopback.Model.extend('person');
      Person.attachTo(db);

      var app = loopback();
      app.use(loopback.rest());
      app.model(Person);

      // Wrap in http server so it can be closed properly
      loopbackServer = http.createServer(app);
      loopbackServer.listen(0, '127.0.0.1', function() {
        http.get({
          host: this.address().address,
          port: this.address().port,
          path: '/people',
        });
      });
    });
