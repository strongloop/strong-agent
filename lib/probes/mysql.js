'use strict';

var path = require('path');
var agent = require('../agent');
var proxy = require('../proxy');
var samples = require('../samples');
var counts = require('../counts');
var tiers = require('../tiers');
var topFunctions = require('../top-functions');
var graphHelper = require('../graph-helper');

// |require_| is used by the test suite, lib/agent.js always passes undefined.
module.exports = function(obj, require_) {

  var Connection = findConnection(obj, require_ || require);
  if (!Connection) {
    return agent.error('failed to instrument mysql');
  }

  proxy.before(Connection.prototype, 'query', function(obj, args) {
    if (agent.paused) return;

    var command = args.length > 0 ? args[0] : undefined;

    var params =
        args.length > 1 && Array.isArray(args[1]) ? args[1] : undefined;
    var timer = samples.timer("MySQL", "query");

    var graphNode = graphHelper.startNode('MySQL', command, agent);
    counts.sample('mysql');

    function handle(obj, args, extra, graph, currentNode) {
      timer.end();
      topFunctions.add('mysqlCalls', command, timer.ms);

      graphHelper.updateTimes(graphNode, timer);

      if (extra) {
        extra.mysql = extra.mysql || 0;
        extra.mysql += timer.ms;
        if (extra.closed) {
          tiers.sample('mysql_out', timer);
        } else {
          tiers.sample('mysql_in', timer);
        }
      } else {
        tiers.sample('mysql_in', timer);
      }
    }

    agent.strongTraceLink("MySQL", command, args);
    proxy.callback(args, -1, handle, null, true);

    if (graphNode) agent.currentNode = graphNode.prevNode;
  });
};

function findConnection(mysql, require) {
  var cache = require.cache;
  for (var key in cache) {
    var candidate = cache[key];
    if (candidate.exports !== mysql) {
      continue;
    }
    var dirname = path.dirname(candidate.filename);
    var filename = path.join(dirname, 'lib', 'Connection.js');
    try {
      return require(filename);
    } catch (e) {
      return null;
    }
  }
  return null;
}
