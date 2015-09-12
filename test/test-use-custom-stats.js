'use strict';

process.env.STRONGLOOP_LICENSE = require('./helpers').longTestLicense();

var EventEmitter = require('events').EventEmitter;
var agent = require('../');
var assert = require('assert');
var tap = require('tap');

var metric = new EventEmitter;

var ok = agent.use(function(name, value) { metric.emit('use', name, value); });

// success/fail cannot be determined, see strongloop/strongops#199,
// assert(ok);

function checkStat(t, name, value, test) {
  metric.once('use', function() {
    t.equal(arguments[0], name, 'stat name');
    t.equal(arguments[1], value, 'stat value');
  });
  process.nextTick(test);
  return 2;
}

tap.test('count', function(t) {
  t.plan(checkStat(t, 'custom.a.count', 1,
                   function() { agent.metrics.stats.increment('a'); }));
});

tap.test('timer', function(t) {
  var timer = agent.metrics.stats.createTimer('b');

  metric.once('use', function(name, value) {
    t.equal(name, 'custom.b.timer');
    t.assert(value >= 180 /*millisec*/, 'time elapsed');
    t.end();
  });

  setTimeout(function() { timer.stop(); }, 200 /*millisec*/);
});
