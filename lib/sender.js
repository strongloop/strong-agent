var agent;
var debug = require('./debug')('sender');
var Timer = require('./timer');
var topFunctions = require('./topFunctions');
var sanitizers = require('./sanitizers');

var infoBuffer;
var metricsBuffer = [];
var tiersBuffer = [];
var loopBuffer = [];
var loopbackTiersBuffers = [];

exports.init = function(agent_, interval) {
  agent = agent_;

  agent.internal.on('info', function(info) {
    infoBuffer = info;
  });

  agent.internal.on('metric', function(metric) {
    metricsBuffer.push(metric);
  });

  agent.internal.on('tiers', function(stats) {
    debug('tiers %j', stats);
    tiersBuffer.push(stats);
  });

  agent.internal.on('loopback_tiers', function (stats) {
    tiersBuffer.push(stats);
  });

  agent.internal.on('callCounts', function (counts) {
    agent.internal.send('update', counts);
  });

  agent.internal.on('loop', function(loop) {
    loopBuffer.push(loop);
  });

  agent.internal.on('instances', function (stats) {
    agent.internal.send('instances', stats);
  });

  topFunctions.on('update', function(update) {
    agent.internal.send('topCalls',
                         { appHash: agent.appHash, update: update });
  });

  Timer.repeat(interval, function() {
    if (!agent.started) {
      return;
    }
    try {
      sendInfo();
      sendMetrics();
      sendTiers();
      sendLoopbackTiers();
      sendLoop();
    }
    catch(e) {
      agent.error(e);
    }
  });
};

function sendInfo() {
  if (!infoBuffer) {
    return;
  }

  infoBuffer = sanitizers.metrics(infoBuffer);
  if (!infoBuffer) {
    return;
  }
  agent.internal.send('update', infoBuffer);
  infoBuffer = undefined;
}

function sendMetrics() {
  if (metricsBuffer.length == 0) {
    return;
  }

  metricsBuffer.map(sanitizers.metrics).forEach(function(metric) {
    if (metric)
      agent.internal.send('update', metric);
  });

  metricsBuffer = [];
}

function sendTiers() {
  debug('sendTiers: %j', tiersBuffer);

  if (tiersBuffer.length == 0) {
    return;
  }

  tiersBuffer.map(sanitizers.metrics).forEach(function(stats) {
    if (stats)
      agent.internal.send('update', stats);
  });

  tiersBuffer = [];
}

function sendLoopbackTiers() {
  if (loopbackTiersBuffers.length === 0) {
    return;
  }

  loopbackTiersBuffers.map(sanitizers.metrics).forEach(function (stats) {
    if (stats)
      agent.internal.send('update', stats);
  });

  loopbackTiersBuffers = [];
}

function sendLoop() {
  if (loopBuffer.length == 0) {
    return;
  }

  loopBuffer.forEach(function(loop) {
    if (loop) agent.internal.send('update', loop);
  });

  loopBuffer = [];
}
