'use strict';

process.env.SL_ENV = 'test';
require('../').profile('deadbeef', 'deadbeef', {quiet: true});

var assert = require('assert');
var http = require('http');
var metrics = require('../lib/metrics');
var agent = require('../');

assert.equal(typeof(gc), 'function', 'Run this test with --expose_gc');

var callbacks = 0;
process.on('exit', function() { assert(callbacks >= 5); });

agent.internal.on('metric', function(metric) {
  callbacks += 1;
  if (metric.name === 'CPU util stime') {
    assert(metric.value >= 0);
    assert(metric.value <= 100);
  }
  if (metric.name === 'CPU util utime') {
    assert(metric.value >= 0);
    assert(metric.value <= 100);
  }
  if (metric.name === 'Heap Data') {
    assert(Array.isArray(metric.value));
    assert.equal(metric.value.length, 3);
  }
  if (metric.name === 'GC Full. V8 heap used') {
    assert(metric.value > 0);
  }
  if (metric.name === 'Connections') {
    assert(Array.isArray(metric.value));
    assert.equal(metric.value.length, 2);
  }
  if (metric.name === 'queue') {
    assert(Array.isArray(metric.value));
    assert.equal(metric.value.length, 2);
  }
});

setInterval(gc, 100).unref();
setTimeout(function() { /* Keep process alive... */ }, 1000);
