var topFunctions = require('./top-functions');
var sanitizers = require('./sanitizers');

exports.init = function(agent, interval) {
  agent.internal.on('metric', function(metric) {
    agent.internal.send('update', sanitizers.metrics(metric));
  });

  agent.internal.on('tiers', function(stats) {
    agent.internal.send('update', sanitizers.metrics(stats));
  });

  agent.internal.on('loopback_tiers', function(stats) {
    agent.internal.send('update', sanitizers.metrics(stats));
  });

  agent.internal.on('callCounts', function(counts) {
    agent.internal.send('update', counts);
  });

  agent.internal.on('loop',
                    function(loop) { agent.internal.send('update', loop); });

  agent.internal.on('instances', function(stats) {
    agent.internal.send('instances', stats);
  });

  topFunctions.on('update', function(update) {
    agent.internal.send('topCalls', {appHash: agent.appHash, update: update});
  });
};
