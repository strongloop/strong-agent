require('../lib/config').baseInterval = 25;

var agent = require('../');
agent.profile('deadbeef', 'deadbeef', {quiet: true});

var assert = require('assert');

var nevents = 0;
agent.internal.on('loop', function(metrics) {
  assert.equal(typeof(metrics.count), 'number');
  assert.equal(typeof(metrics.slowest_ms), 'number');
  assert.equal(typeof(metrics.sum_ms), 'number');
  assert.equal(metrics.count, metrics.count | 0);
  assert.equal(metrics.slowest_ms, metrics.slowest_ms | 0);
  assert.equal(metrics.sum_ms, metrics.sum_ms | 0);
  assert(metrics.count >= 0);
  assert(metrics.slowest_ms >= 0);
  assert(metrics.sum_ms >= 0);
  nevents += 1;
});

setTimeout(function() {}, 200);

process.on('exit', function() { assert(nevents > 0); });
