var assert = require('assert');
var profiler = require('../lib/profilers/cpu');

profiler.start();
for (var i = 0, j = 1; i < 1e6; i++) {
  j = (j + i) * (j + i);
}
// Stop V8 from optimizing away the loop.
global.ASSIGNMENT_FOR_SIDE_EFFECT = j;

var data = profiler.stop();
assert.equal(typeof(data), 'object');
assert.equal(data === null, false);
assert.equal(Array.isArray(data.children), true);
assert.equal(typeof(data.functionName), 'string');
