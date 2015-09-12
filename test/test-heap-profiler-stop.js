'use strict';

var agent = require('../');
agent.profile('deadbeef', 'deadbeef', {quiet: true});

var assert = require('assert');
var profiler = require('../lib/profilers/memory');

profiler.init(agent);
profiler.start();
for (var retain = [], i = 0; i < 1e3; i += 1) {
  retain.push([i]);
}
var state = profiler.poll();
profiler.stop();
assert(state != null);
assert(state.length > 0);
state.forEach(function(elm) {
  assert.equal(typeof(elm.type), 'string');
  assert.equal(typeof(elm.size), 'number');
  assert.equal(typeof(elm.total), 'number');
});
