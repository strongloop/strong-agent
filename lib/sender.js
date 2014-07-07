var agent;
var Timer = require('./timer');
var topFunctions = require('./topFunctions');
var sanitizers = require('./sanitizers');

var infoBuffer;
var metricsBuffer = [];
var tiersBuffer = [];
var loopBuffer = [];
var loopbackTiersBuffers = [];

exports.init = function(interval) {
  agent = global.STRONGAGENT;

  agent.internal.on('info', function(info) {
    infoBuffer = info;
  });

  agent.internal.on('metric', function(metric) {
    metricsBuffer.push(metric);
  });

  agent.internal.on('tiers', function(stats) {
    tiersBuffer.push(stats);
  });

  agent.internal.on('loopback_tiers', function (stats) {
    tiersBuffer.push(stats);
  });

  agent.internal.on('callCounts', function (counts) {
    agent.transport.send('update', counts);
  });

  agent.internal.on('loop', function(loop) {
    loopBuffer.push(loop);
  });

  agent.internal.on('instances', function (stats) {
    agent.transport.send('instances', stats);
  });

  topFunctions.on('update', function(update) {
    agent.transport.send('topCalls',
                         { appHash: agent.appHash, update: update });
  });

  Timer.repeat(interval, function() {
    if (agent.transport.disconnected()) {
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
  agent.transport.send('update', infoBuffer);
  infoBuffer = undefined;
}

function sendMetrics() {
  if (metricsBuffer.length == 0) {
    return;
  }

  metricsBuffer.map(sanitizers.metrics).forEach(function(metric) {
    if (metric)
      agent.transport.send('update', metric);
  });

  metricsBuffer = [];
}

function sendTiers() {
  if (tiersBuffer.length == 0) {
    return;
  }

  tiersBuffer.map(sanitizers.metrics).forEach(function(stats) {
    if (stats)
      agent.transport.send('update', stats);
  });

  tiersBuffer = [];
}

function sendLoopbackTiers() {
  if (loopbackTiersBuffers.length === 0) {
    return;
  }

  loopbackTiersBuffers.map(sanitizers.metrics).forEach(function (stats) {
    if (stats)
      agent.transport.send('update', stats);
  });

  loopbackTiersBuffers = [];
}

function sendLoop() {
  if (loopBuffer.length == 0) {
    return;
  }

  loopBuffer.forEach(function(loop) {
    if (loop) agent.transport.send('update', loop);
  });

  loopBuffer = [];
}
