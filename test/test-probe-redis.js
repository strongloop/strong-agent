'use strict';

var maybeSkip = process.env.REDIS_HOST && process.env.REDIS_PORT
              ? false
              : {skip: 'Incomplete Redis environment.'};

process.env.STRONGLOOP_LICENSE = require('./helpers').shortTestLicense();

var agent = require('../');
var assert = require('assert');
var tap = require('tap');

var metrics = [];
agent.use(metrics.push.bind(metrics));

agent.error = assert.fail;

var CORRECT_KEY = 'redis_key';
var CORRECT_VALUE = '42';

tap.test('Redis probe', maybeSkip, function(t) {
  var client = require('redis').createClient();
  client.on('error', function (err) {
    t.ok(err != null, "Redis no errors.");
    if (err) {
      client.end();
      t.end();
      return;
    };
  });

  client.set([CORRECT_KEY, CORRECT_VALUE], function(err, result) {
    var setSuccess = (err == null && result != null);
    t.ok(setSuccess, 'Redis set succeeded.');
    if (!setSuccess) {client.end(); t.end(); return;}
    t.comment('set result: ' + JSON.stringify(result));
    t.equal(result, 'OK', 'Redis correct set result returned');
    client.get(CORRECT_KEY, function(err, result) {
      var getSuccess = (err == null && result != null);
      t.ok(getSuccess, 'Redis get succeeded.');
      if (!getSuccess) {
        client.end();
        t.end();
        return;
      }
      t.comment('get result: ' + JSON.stringify(result));
      t.equal(result, CORRECT_VALUE, 'Redis correct get result returned');
      // verify the recorded Redis metrics
      agent.poll();
      t.comment('metrics: ' + JSON.stringify(metrics));
      var ixAvg = metrics.indexOf('tiers.redis.average');
      var ixMin = metrics.indexOf('tiers.redis.minimum');
      var ixMax = metrics.indexOf('tiers.redis.maximum');
      t.ok(ixAvg > -1 && metrics.length > ixAvg, 'Redis avg metric exists.');
      t.ok(ixMin > -1 && metrics.length > ixMin, 'Redis min metric exists.');
      t.ok(ixMax > -1 && metrics.length > ixMax, 'Redis max metric exists.');
      t.ok(metrics[ixAvg + 1] > 0, 'Redis avg metric is valid.');
      t.ok(metrics[ixMin + 1] > 0, 'Redis min metric is valid.');
      t.ok(metrics[ixMax + 1] > 0, 'Redis max metric is valid.');
      client.end();
      t.end();
    });
  });
});
