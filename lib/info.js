var os = require('os');
var Timer = require('./timer');
var addon = require('./addon');
var platform = os.platform();

var osScope = os.hostname();
var processScope = osScope + ' - Process[' + process.pid + ']';

var agent;
var config = {};
var lastCpuTime;
var last_cpu_util;
var gcstats = [];

exports.init = function(agent_, collectInterval) {
  agent = agent_;
  config.collectInterval = collectInterval;

  if (!addon) {
    return;
  }

  addon.onGC(function(stats){

    gcstats.push(stats);

    var len   = gcstats.length;
    var total = 0;

    gcstats.forEach(function(stat){
      total += stat;
    })

    var baseline = total / len / 1000000;

    agent.metric(processScope, 'GC Full. V8 heap used', baseline, 'MB');
    collectHeap(baseline);

    if (len>10) {
      gcstats = gcstats.splice(1,len);
    }

  });

  Timer.repeat(config.collectInterval, function() {
    try {
      collect();
      connectionInfo();
      collectHeap();
    }
    catch(e) { agent.error(e); }
  });

  osScope = os.hostname();
  processScope = osScope + ' - Process[' + process.pid + ']';

  collect();
};

function collectHeap(gcFull) {
  try {
    var mem = process.memoryUsage();
    var rss = mem.rss / 1000000;
    var heapUsed = mem.heapUsed / 1000000;
    var heapData = [ heapUsed, rss, gcFull];

    agent.metric(processScope, 'Heap Data', heapData, 'MB');
  }
  catch(err) {
    agent.error(err);
  }
}

function connectionInfo() {
  // FIXME(bnoordhuis) Tracks only one HTTP server per process and it's not
  // very deterministic what server that is...
  var server = agent.httpServer;
  if (server == null) return;
  var kContextPropertyName = '__STRONGOPS_HTTP_CONTEXT__';
  var context = server[kContextPropertyName];
  var curr = context.connectionCounts[0];
  var prev = context.connectionCounts[1];
  context.connectionCounts[0] = 0;
  context.connectionCounts[1] = curr;
  if (server.getConnections) {
    server.getConnections(callback);
  } else {
    callback(null, server.connections || server._connections || 0);
  }
  function callback(err, conns) {
    if (err) return;
    var tps = curr / (config.collectInterval / 1000);
    var metrics = [conns, tps, curr, prev];
    agent.metric(processScope, 'Connections', metrics, '');
  }
}


var collect = function() {
  require('./cpuinfo').cpuutil(function(percent_proc,percent_user,percent_syst){
    agent.metric(processScope, 'CPU util',       percent_proc, '%');
    agent.metric(processScope, 'CPU util stime', percent_syst, '%');
    agent.metric(processScope, 'CPU util utime', percent_user, '%');
  });
};
