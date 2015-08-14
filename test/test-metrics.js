'use strict';

require('../lib/config').baseInterval = 100;
require('../').profile('deadbeef', 'deadbeef', {quiet: true});

var assert = require('assert');
var http = require('http');
var metrics = require('../lib/metrics');
var agent = require('../');

assert.equal(typeof(gc), 'function', 'Run this test with --expose_gc');

var callbacks = 0;
process.on('exit', function() { assert(callbacks >= 5); });

agent.internal.on('metrics', function(data) {
  for (var name in data) {
    metric(name, data[name]);
  }
});

function metric(name, value) {
  callbacks += 1;
  if (name === 'CPU util stime') {
    assert(value >= 0);
    assert(value <= 100);
  }
  if (name === 'CPU util utime') {
    assert(value >= 0);
    assert(value <= 100);
  }
  if (name === 'Heap Data') {
    assert(Array.isArray(value));
    assert.equal(value.length, 3);
  }
  if (name === 'GC Full. V8 heap used') {
    assert(value > 0);
  }
  if (name === 'Connections') {
    assert(Array.isArray(value));
    assert.equal(value.length, 2);
  }
  if (name === 'queue') {
    assert(Array.isArray(value));
    assert.equal(value.length, 2);
  }
}

setInterval(gc, 100).unref();
setTimeout(function() { /* Keep process alive... */ }, 1000);
