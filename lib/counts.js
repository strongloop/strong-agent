var agent;

var Timer = require('./timer');
var sanitizers = require('./sanitizers');

var counts = null;

exports.init = function(agent_, interval) {
  agent = agent_;
  start(interval);
};

exports.sample = function(code) {
  if (counts == null) counts = {};
  counts[code] = 1 + (counts[code] | 0);
};

function start(interval) {
  Timer.repeat(interval, function() {
    if (counts == null) return;
    var snapshot = counts;
    counts = null;
    agent.internal.emit('i::counts', snapshot);
  });
}
