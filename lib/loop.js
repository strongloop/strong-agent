var debug = require('./debug')('loop');

var agent;
var Timer = require('./timer');
var addon = require('./addon');

var config = {};

exports.init = function(agent_, loopInterval) {
  agent = agent_;
  config.loopInterval = loopInterval;
  if (!addon) {
    return;
  }
  start();
}

function start() {
  debug('starting uvmon');

  var statistics = addon.eventLoopStatistics;
  Timer.repeat(config.loopInterval, function() {
    var min = statistics[0];
    var max = statistics[1];
    var num = statistics[2];
    var sum = statistics[3];

    statistics[0] = 0;
    statistics[1] = 0;
    statistics[2] = 0;
    statistics[3] = 0;

    // XXX(bnoordhuis) Backwards compatible field names.
    // XXX(bnoordhuis) fastest_ms is new though.
    var stats = { count: num, fastest_ms: min, slowest_ms: max, sum_ms: sum };
    agent.internal.emit('loop', { loop: stats });

    // we're also going to shoehorn it into the metric data to make our life easier
    agent.metric(null, 'queue', [max, num ? sum / num : 0]);

    if (debug.enabled) {
      debug('%s', JSON.stringify(stats));
    }
  });
}
