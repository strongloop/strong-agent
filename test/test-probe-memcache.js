'use strict';

var maybeSkip = process.env.MEMCACHED_HOST && process.env.MEMCACHED_PORT
              ? false
              : {skip: 'Incomplete memcached environment.'};

process.env.STRONGLOOP_LICENSE = require('./helpers').shortTestLicense();

var agent = require('../');
var assert = require('assert');
var tap = require('tap');

var metrics = [];
agent.use(metrics.push.bind(metrics));

agent.error = assert.fail;

tap.test('Memcache probe', maybeSkip, function(t) {
  var Memcache = require('memcache');
  var client = null;
  try {
    client = new Memcache.Client(
        parseInt(process.env.MEMCACHED_PORT, 10),
        process.env.MEMCACHED_HOST);
    client.connected = false;
    client.connect();
  } catch(e) {
    t.fail('Memcache connection failed: ' + err);
    t.end();
    return;
  }
  client.addHandler(function() {
    client.connected = true;
    t.ok(client.connected, 'Memcache connected.');
    var dataLifeInSeconds = 10;
    client.set('key', '42', function(err) {
      var setSuccess = (err == null);
      t.ok(setSuccess, 'Memcache set succeeded.');
      if (!setSuccess) {
        client.close();
        t.end();
        return;
      }
      // verify the recorded Memcache metrics
      agent.poll();
      t.comment('metrics: ' + JSON.stringify(metrics));
      var ixAvg = metrics.indexOf('tiers.memcached.average');
      var ixMin = metrics.indexOf('tiers.memcached.minimum');
      var ixMax = metrics.indexOf('tiers.memcached.maximum');
      t.ok(ixAvg > -1 && metrics.length > ixAvg, 'Memcache avg metric exists.');
      t.ok(ixMin > -1 && metrics.length > ixMin, 'Memcache min metric exists.');
      t.ok(ixMax > -1 && metrics.length > ixMax, 'Memcache max metric exists.');
      t.ok(metrics[ixAvg + 1] > 0, 'Memcache avg metric is valid.');
      t.ok(metrics[ixMin + 1] > 0, 'Memcache min metric is valid.');
      t.ok(metrics[ixMax + 1] > 0, 'Memcache max metric is valid.');
      client.close();
      t.end();
    }, dataLifeInSeconds);
  });
});
