var tap = require('tap');
var util = require('util');
var customStats = require('../lib/custom-stats');
var EE = new require('events').EventEmitter;
var agent = {internal: new EE};
var stats = customStats.init(agent);

function checkStat(t, stat, value, type, test) {
  agent.internal.once('i::stats', function() {
    console.error(arguments);
    t.equal(arguments[0], stat, 'stat name');
    t.equal(arguments[1], value, 'stat value');
    t.equal(arguments[2], type, 'stat type');
  });
  process.nextTick(test);
  return 3;
}

tap.test('inc starts at zero', function(t) {
  t.plan(checkStat(t, 'custom.a', +1, 'count',
                   function() { stats.increment('a'); }));
});

tap.test('dec starts at zero', function(t) {
  t.plan(checkStat(t, 'custom.b', -1, 'count',
                   function() { stats.decrement('b'); }));
});

tap.test('count is maintained', function(t) {
  stats.increment('c');
  stats.increment('c');
  stats.decrement('c');
  stats.increment('c');
  stats.decrement('c');
  stats.decrement('c');
  stats.decrement('c');

  t.plan(checkStat(t, 'custom.c', -2, 'count',
                   function() { stats.decrement('c'); }));
});

tap.test('timer start and stop', function(t) {
  var timer = stats.createTimer('a.b');
  setTimeout(function() {
    var triggered;
    agent.internal.on('i::stats', function(stat, value, type) {
      t.assert(!triggered);  // should never trigger multiple times

      t.assert(value > 0.09 * 1e9 /*nanosec*/, 'value ' + util.inspect(value));
      t.equal(stat, 'custom.a.b');
      t.equal(type, 'timer');

      triggered = true;
    });

    timer.stop();
    timer.stop();

    setTimeout(function() {
      // wait to ensure multiple trigger did not occur
      t.end();
    }, 10);
  }, 0.1 * 1e3 /*millisec*/);
});
