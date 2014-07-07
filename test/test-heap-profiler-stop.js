process.env.SL_ENV = 'dev';
require('../').profile('deadbeef', 'deadbeef', { quiet: true });

var assert = require('assert');
var profiler = require('../lib/profilers/memory');

// FIXME(bnoordhuis) profiler.stop() is pretty much a no-op, the only thing
// it currently does is stop the interval timer.  The 'instance' event is
// because profiler.start() calls _step() synchronously.  I'm inclined to
// say that's a bug because it only captures heap changes between the call
// to `new HeapDiff` and _step().  Nothing interesting in other words but
// it's still sent to the collector.
var instance = null;
profiler.init();
profiler.agent.internal.on('instances', function(o) { instance = o });
profiler.start();
profiler.stop();
assert(instance != null);
assert(instance.state != null);
assert(instance.state.length > 0);
instance.state.forEach(function(elm) {
  assert.equal(typeof(elm.type), 'string');
  assert.equal(typeof(elm.size), 'number');
  assert.equal(typeof(elm.total), 'number');
});

