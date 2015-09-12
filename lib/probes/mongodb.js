'use strict';

var agent = require('../agent');
var proxy = require('../proxy');
var samples = require('../samples');
var counts = require('../counts');
var tiers = require('../tiers');
var topFunctions = require('../top-functions');
var graphHelper = require('../graph-helper');

var internalCommands = [
  '_executeQueryCommand',
  '_executeInsertCommand',
  '_executeUpdateCommand',
  '_executeRemoveCommand'
];

var commandMap = {
  '_executeQueryCommand': 'find',
  '_executeInsertCommand': 'insert',
  '_executeUpdateCommand': 'update',
  '_executeRemoveCommand': 'remove'
};

var tier = 'mongodb';
function recordExtra(extra, timer) {
  if (extra) {
    extra[tier] = extra[tier] || 0;
    extra[tier] += timer.ms;

    if (extra.closed) {
      tiers.sample(tier + '_out', timer);
    } else {
      tiers.sample(tier + '_in', timer);
    }
  } else {
    tiers.sample(tier + '_in', timer);
  }
}

// Map to convert query property types to sane defaults
var blank = {
  '[object String]': '',
  '[object Boolean]': false,
  '[object Number]': 0,
  '[object RegExp]': /.*/,
  '[object Date]': new Date
};

var toString = Object.prototype.toString;

module.exports = function(mongodb) {
  internalCommands.forEach(function(internalCommand) {
    var cmd = commandMap[internalCommand];
    proxy.before(mongodb.Collection.prototype, cmd, function(obj, args) {
      var command = args[0] || {};
      var q = typeof(command) === 'object' ?
          JSON.stringify(command) : command.toString();
      var fullQuery = cmd + '(' + q + ')';

      function strongTraceTransaction(query, callback){
        var linkName = "MongoDB " + query;
        return agent.transactionLink(linkName, callback);
      }

      var timer = samples.timer("MongoDB", commandMap[internalCommand]);

      var callbackIndex = args.length - 1;
      while (callbackIndex >= 0 && typeof(args[callbackIndex]) !== 'function') {
        callbackIndex -= 1;
      }

      var graphNode = graphHelper.startNode('MongoDB', fullQuery, agent);
      counts.sample('mongodb');

      function mongoCalls(obj, args, extra, graph, currentNode) {
        timer.end();
        topFunctions.add('mongoCalls', fullQuery, timer.ms);
        recordExtra(extra, timer);
        graphHelper.updateTimes(graphNode, timer);
      }

      if (callbackIndex === -1) {
        // updates and inserts are fire and forget unless safe is set
        // record these in top functions, just for tracking
        topFunctions.add('mongoCalls', fullQuery, 0);
        tiers.sample(tier + '_in', timer);
      } else {
        args[callbackIndex] =
            strongTraceTransaction(fullQuery, args[callbackIndex]);
        proxy.callback(args, callbackIndex, mongoCalls);
      }

      if (graphNode) agent.currentNode = graphNode.prevNode;
    });
  });  // all commands
};     // require mongo
