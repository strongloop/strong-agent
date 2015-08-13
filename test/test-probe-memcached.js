'use strict';

var maybeSkip = process.env.MEMCACHED_HOST && process.env.MEMCACHED_PORT
              ? false
              : {skip: 'Incomplete memcached environment.'};

process.env.STRONGLOOP_LICENSE = require('./helpers').shortTestLicense();

var agent = require('../');
var assert = require('assert');
var tap = require('tap');
var installPackage = require('./helpers').installPackage;

var metrics = [];
agent.use(metrics.push.bind(metrics));

agent.error = assert.fail;

tap.test('Memcached probe', maybeSkip, function(t) {
  installPackage('memcached@latest', function(err) {
    if (err) {
      t.skip(err.message);
      t.end();
      return;
    }
    var Memcached = require('memcached');
    var client = null;
    try {
      client = new Memcached(
          process.env.MEMCACHED_HOST + ':' + process.env.MEMCACHED_PORT,
          {retries: 4, retry: 10, remove: true});
    } catch(e) {
      t.fail('Memcached connection failed: ' + err);
      t.end();
      return;
    }
    t.ok(client != null, 'Memcached connected.');
    var dataLifeInSeconds = 10;
    client.set('key', '42', dataLifeInSeconds, function(err) {
      var setSuccess = (err == null);
      t.ok(setSuccess, 'Memcached set succeeded.');
      if (!setSuccess) {
        client.end();
        t.end();
        return;
      }
      // verify the recorded Memcached metrics
      agent.poll();
      t.comment('metrics: ' + JSON.stringify(metrics));
      var ixAvg = metrics.indexOf('tiers.memcached.average');
      var ixMin = metrics.indexOf('tiers.memcached.minimum');
      var ixMax = metrics.indexOf('tiers.memcached.maximum');
      t.ok(ixAvg > -1 && metrics.length > ixAvg,
           'Memcached avg metric exists.');
      t.ok(ixMin > -1 && metrics.length > ixMin,
           'Memcached min metric exists.');
      t.ok(ixMax > -1 && metrics.length > ixMax,
           'Memcached max metric exists.');
      t.ok(metrics[ixAvg + 1] > 0, 'Memcached avg metric is valid.');
      t.ok(metrics[ixMin + 1] > 0, 'Memcached min metric is valid.');
      t.ok(metrics[ixMax + 1] > 0, 'Memcached max metric is valid.');
      client.end();
      t.end();
    });
  });
});
