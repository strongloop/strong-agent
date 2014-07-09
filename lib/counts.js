var agent;

var Timer = require('./timer');
var sanitizers = require('./sanitizers');

var stats = {
  callCounts: {}
};

exports.init = function(agent_, interval) {
  agent = agent_;
  start(interval);
};

exports.sample = function(code) {
  // Note that only 'strongmq_in' and 'strongmq_out' are actually used at all
  stats.callCounts[code] = stats.callCounts[code] || { count: 0 };
  stats.callCounts[code].count += 1;
};

function start(interval) {
  Timer.repeat(interval, function () {
    var snapshot = sanitizers.metrics(stats);
    stats.callCounts = {};
    if (snapshot) {
      agent.internal.emit('callCounts', snapshot);
    }
  });
}
