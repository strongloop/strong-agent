var assert = require('assert');
var profiler = require('../lib/profilers/cpu');

profiler.start();

var i;
var j;
var data;
setImmediate(spin);

function spin() {
  for (i = 0, j = 1; i < 1e6; i++) {
    j = (j + i) * (j + i);
  }

  // Stop V8 from optimizing away the loop.
  global.ASSIGNMENT_FOR_SIDE_EFFECT = j;
  data = profiler.stop();
  setImmediate(verify);
}

function verify() {
  console.log('# %s', require('util').inspect(data, false, 128));
  assert.equal(typeof(data), 'object');
  assert.equal(data === null, false);
  assert.equal(Array.isArray(data.children), true);
  assert.equal(typeof(data.functionName), 'string');
}
