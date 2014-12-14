// Use 50 ms intervals for metrics collection.
process.env.STRONGAGENT_INTERVAL_MULTIPLIER = 20;
process.env.SL_ENV = 'test';
process.env.SL_KEY = 'some key';
var helpers = require('./helpers');
process.env.STRONGLOOP_LICENSE = helpers.shortTestLicense();

var agent = require('../');
var assert = require('assert');
var fmt = require('util').format;

var metrics = [];
agent.use(metrics.push.bind(metrics));

assert.equal(typeof(gc), 'function', 'Run this test with --expose_gc');
assert.equal(agent.metrics.startTrackingObjects(), true);
for (var timeout = 0; timeout < 60; timeout += 12) setTimeout(gc, timeout);
setTimeout(one, 60);

function one() {
  agent.metrics.stopTrackingObjects();
  assert(metrics.length > 0);

  // These are almost guaranteed to exist in the output.  It's tricky of course
  // because garbage collection is fairly non-deterministic and the GC algorithm
  // may change over time.
  check('object.Array.count');
  check('object.Array.size');
  check('object.Timeout.count');
  check('object.Timeout.size');

  metrics = [];
  metrics.push = assert.fail;
  for (var timeout = 0; timeout < 60; timeout += 12) setTimeout(gc, timeout);
  setTimeout(two, 60);
}

function two() {
  assert.equal(metrics.filter(/ /.test.bind(/^object\./)).length, 0);
}

function check(key) {
  var index = metrics.indexOf(key);
  if (index === -1) throw Error(fmt('Key %j not found in %j', key, metrics));
  assert.equal(typeof(metrics[index + 1]), 'number');
}
