// Copyright (c) 2014, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

var addon = require('../lib/addon');
var assert = require('assert');

assert.equal(typeof(gc), 'function', 'Run this test with --expose_gc');

var names = [];
Object.keys(addon.counters).forEach(function(name) {
  var index = addon.counters[name];
  names[index] = name;
});

var metrics = [];
addon[addon.kCountersCallback] = function(samples, n) {
  assert.equal(n % 2, 0);
  for (var i = 0; i < n; i += 1) metrics.push(samples[i]);
};

addon.startCounters();
for (var i = 0; i < 1337; i += 1) JSON.parse(JSON.stringify(process.config));
gc();

// Wait for the counter aggregator's idle timer to run.
setTimeout(function() {
  addon[addon.kCountersCallback] = assert.fail;
  addon.stopCounters();
  assert(metrics.length > 0);
  assert.equal(metrics.length % 2, 0);
  for (var i = 0, n = metrics.length; i < n; i += 2) {
    var index = metrics[i + 0];
    var value = metrics[i + 1];
    assert.equal(typeof names[index], 'string');
    assert.equal(typeof value, 'number');
  }
}, 20);
