'use strict';

process.env.STRONGLOOP_LICENSE = require('./helpers').shortTestLicense();
require('../lib/config').baseInterval = 25;

var agent = require('../');
var assert = require('assert');

var polls = 0;
var metrics = [];
var started = false;

agent.on('poll::start', function() {
  assert.equal(started, false);
  started = true;
  polls += 1;
});

agent.on('poll::stop', function() {
  assert.equal(started, true);
  started = false;
});

agent.use(function(name, value) {
  assert.equal(started, true);
  metrics.push(name, value);
});

process.on('exit', function() {
  assert(metrics.length > 0);
  assert(polls > 0);
});

setTimeout(function() {}, 100);
