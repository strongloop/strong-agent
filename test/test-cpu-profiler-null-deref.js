var assert = require('assert');
var profiler = require('../lib/profilers/cpu');

profiler.start();
assert.notEqual(profiler.stop(), undefined);
assert.equal(profiler.stop(), undefined);  // Should not segfault.
