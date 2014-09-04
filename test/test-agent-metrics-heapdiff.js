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
agent.metrics.stopTrackingObjects();
assert(metrics.length > 0);

// These are almost guaranteed to exist in the output.  It's tricky of course
// because garbage collection is fairly non-deterministic and the GC algorithm
// may change over time.
// XXX(rmg): node v0.11.x seems to favour object.Object over object.Array :-/
if (/v0\.10/.test(process.version)) {
  assert(0 < find('object.Array.count'));
  assert(0 < find('object.Array.size'));
} else {
  assert(0 < find('object.Object.count'));
  assert(0 < find('object.Object.size'));

}
assert(0 < find('object.Timeout.count'));
assert(0 < find('object.Timeout.size'));

metrics = [];
metrics.push = assert.fail;
for (var timeout = 0; timeout < 60; timeout += 12) setTimeout(gc, timeout);
assert.equal(metrics.filter(/ /.test.bind(/^object\./)).length, 0);

function find(key) {
  var index = metrics.indexOf(key);
  if (index === -1)
    throw Error(fmt('Key %j not found in %j', key, metrics));
  return metrics[index + 1];
}
