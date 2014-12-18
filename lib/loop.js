var addon = require('./addon');
var agent;

exports.init = function(agent_) {
  agent = agent_;
};

exports.poll = function() {
  if (!addon) {
    return;
  }
  var statistics = addon.eventLoopStatistics;
  var min = statistics[0];
  var max = statistics[1];
  var num = statistics[2];
  var sum = statistics[3];

  statistics[0] = 0;
  statistics[1] = 0;
  statistics[2] = 0;
  statistics[3] = 0;

  // we're also going to shoehorn it into the metric data to make our life
  // easier
  agent.metric(null, 'queue', [max, num ? sum / num : 0]);

  if (num === 0) {
    return null;
  }

  // XXX(bnoordhuis) Backwards compatible field names.
  // XXX(bnoordhuis) fastest_ms is new though.
  return {count: num, fastest_ms: min, slowest_ms: max, sum_ms: sum};
};
