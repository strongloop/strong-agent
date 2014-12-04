process.env.SL_ENV = 'dev';
require('../lib/config').baseInterval = 25;

var agent = require('../');
agent.profile('deadbeef', 'deadbeef', {quiet: true});

var assert = require('assert');

var nevents = 0;
agent.internal.on('loop', function(o) {
  assert.equal(typeof(o.loop), 'object');
  assert.equal(typeof(o.loop.count), 'number');
  assert.equal(typeof(o.loop.slowest_ms), 'number');
  assert.equal(typeof(o.loop.sum_ms), 'number');
  assert.equal(o.loop.count, o.loop.count | 0);
  assert.equal(o.loop.slowest_ms, o.loop.slowest_ms | 0);
  assert.equal(o.loop.sum_ms, o.loop.sum_ms | 0);
  assert(o.loop.count >= 0);
  assert(o.loop.slowest_ms >= 0);
  assert(o.loop.sum_ms >= 0);
  nevents += 1;
});

setTimeout(function() {}, 200);

process.on('exit', function() { assert(nevents > 0); });
