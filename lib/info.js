var addon = require('./addon');
var cpuinfo = require('./cpuinfo');
var os = require('os');

var osScope = os.hostname();
var processScope = osScope + ' - Process[' + process.pid + ']';

var agent;
var gcstats = [];
var timebase;

exports.init = function(agent_) {
  agent = agent_;

  if (!addon) {
    return;
  }

  addon[addon.kGarbageCollectorStatisticsCallback] = function(samples) {
    for (var i = 0, n = samples.length; i < n; i += 1) {
      var len = gcstats.push(samples[i]);
      var total = gcstats.reduce(function(a, b) { return a + b });
      var baseline = total / len / 1e6;
      agent.metric(processScope, 'GC Full. V8 heap used', baseline, 'MB');
      collectHeap(baseline);
      if (len > 10) {
        gcstats.shift();  // Sliding window.
      }
    }
  };
  addon.startGarbageCollectorStatistics();

  timebase = Date.now();
  collect();
};

exports.poll = function() {
  collect();
  connectionInfo();
  collectHeap();
};

function collectHeap(gcFull) {
  var mem = process.memoryUsage();
  var rss = mem.rss / 1000000;
  var heapUsed = mem.heapUsed / 1000000;
  var heapData = [heapUsed, rss, gcFull];
  agent.metric(processScope, 'Heap Data', heapData, 'MB');
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
    var now = Date.now();
    var tps = curr / (now - timebase) / 1000;
    timebase = now;
    var metrics = [conns, tps, curr, prev];
    agent.metric(processScope, 'Connections', metrics, '');
  }
}

function collect() {
  cpuinfo.cpuutil(function(percent_proc, percent_user, percent_syst) {
    agent.metric(processScope, 'CPU util', percent_proc, '%');
    agent.metric(processScope, 'CPU util stime', percent_syst, '%');
    agent.metric(processScope, 'CPU util utime', percent_user, '%');
  });
}
