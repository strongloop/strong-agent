var topFunctions = require('./top-functions');
var sanitizers = require('./sanitizers');

exports.init = function(agent) {
  agent.internal.on('metric', function(metric) {
    agent.internal.send('update', sanitizers.metrics(metric));
  });

  agent.internal.on('tiers', function(stats) {
    agent.internal.send('update', stats);
  });

  agent.internal.on('loopback_tiers', function(stats) {
    agent.internal.send('update', stats);
  });

  agent.internal.on('counts', function(counts) {
    var cooked = {};
    for (var key in counts) {
      cooked[key] = {count: counts[key]};
    }
    agent.internal.send('update', {callCounts: cooked});
  });

  agent.internal.on('loop',
                    function(loop) { agent.internal.send('update', loop); });

  agent.internal.on('instances', function(stats) {
    agent.internal.send('instances', stats);
  });

  agent.internal.on('topCalls', function(update) {
    agent.internal.send('topCalls', {appHash: agent.appHash, update: update});
  });
};
