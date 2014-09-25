process.env.STRONGLOOP_LICENSE = require('./helpers').longTestLicense();

var EventEmitter = require('events').EventEmitter;
var agent = require('../');
var assert = require('assert');
var async = require('async');
var tap = require('tap');
var target = require('./dyninst-target');
var util = require('util');

var output = [];

agent.use(function(name, value) { output.push([name, value]); });

agent.dyninst.metrics.patch({
  'dyninst-target': [
    {type: 'increment', line: 18, metric: 'runner'},
    {type: 'decrement', line: 19, metric: 'runner'},
    {type: 'timer-start', line: 18, metric: 'runner', context: 'this'},
    {type: 'timer-stop', line: 19, metric: 'runner', context: 'self'},
  ]
});

function checkCount(t, at, value) {
  t.deepEqual(output[at], ['custom.runner.count', value]);
}

function checkOutputTimer(t, at, real) {
  t.equal(output[at][0], 'custom.runner.timer');
  checkTimer(t, output[at][1], real);
}

function checkTimer(t, value, real) {
  var extra = util.format('want %d ms, metric %d ms, self-timed %d ms',
                          target.Runner.interval, value, real);
  // Assert time is within a few ms... this might be too sensitive for CI.
  t.assert(value > target.Runner.interval - 1, extra);
  t.assert(value < target.Runner.interval + 3, extra);
}

tap.test('concurrency 1', function(t) {
  var r = new target.Runner();

  r.start().once('done', function() {
    console.log('output:', output);
    checkCount(t, 0, 1);
    checkCount(t, 2, 0);
    checkOutputTimer(t, 1, this.diff);
    t.end();
  });
});

var N = 12;

tap.test('concurrency ' + N, function(t) {
  function run(done) {
    var r = new target.Runner();

    r.start().once('done', function() { return done(null, this.diff / 1); });
  }

  output = [];

  async.parallel(repeat(run, N), function(er, diffs) {
    console.log('diffs:', diffs);

    t.ifError(er);

    // concurrency count = 1..N, N-1..0
    var counts = pick(/count/, 1);
    console.log('counts:', counts);
    t.equal(counts.length, 2 * N);
    t.equal(counts[0], 1);
    t.equal(counts[N - 1], N);
    t.equal(counts[counts.length - 1], 0);

    // N timers, all just over Runner.interval
    var timers = pick(/timer/, 1);
    t.equal(timers.length, N);
    t.equal(diffs.length, N);
    console.log('timers:', timers);
    for (var i = 0; i < (timers.length); i++) {
      checkTimer(t, timers[i], diffs[i]);
    }

    t.end();
  });
});

function repeat(item, count) {
  var _ = [];
  for (var i = 0; i < count; i++) {
    _.push(item);
  }
  return _;
}

function pick(name, index) {
  return output.filter(function(_) { return name.test(_[0]); })
      .map(function(_) { return _[index] });
}
