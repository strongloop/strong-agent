var path = require('path');
var agent = require('../agent');
var proxy = require('../proxy');
var samples = require('../samples');
var counts = require('../counts');
var tiers = require('../tiers');
var topFunctions = require('../top-functions');
var graphHelper = require('../graph-helper');

module.exports = function(obj) {

  var Connection = findConnection(obj);
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

    proxy.callback(args, -1, function(obj, args, extra, graph, currentNode) {
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
    }, null, true);

    if (graphNode) agent.currentNode = graphNode.prevNode;
  });
};

var cache = require.cache;
var mysqlConnPathPat = /mysql[\/\\]+lib[\/\\]+Connection\.js$/;

// given module mysql, search the require cache for the corresponding
// Connection prototype
function findConnection(mysql) {
  var k, candidate;
  for (k in cache) {
    candidate = cache[k];
    if (candidate.exports === mysql) {
      for (k in candidate.children) {
        if (mysqlConnPathPat.test(candidate.children[k].id)) {
          return candidate.children[k].exports;
        }
      }
    }
  }
  return null;
}
