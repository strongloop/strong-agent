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

// Sanitize the query
function sanitize(input) {
  var output = {};

  function filterValue(value) {
    var type = toString.call(value);

    // If the value is an array, map children
    if (Array.isArray(value)) {
      return value.map(filterValue);
    }

    // If it is in the conversion table, use the corresponding "blank" value
    if (typeof blank[type] !== 'undefined') {
      return blank[type];
    }

    // If it is a non-null object, sanitize children
    if (typeof value === 'object' && value !== null) {
      return sanitize(value);
    }

    return value;
  }

  Object.keys(input)
      .forEach(function(key) { output[key] = filterValue(input[key]); });

  return output;
}

module.exports = function(mongodb) {
  internalCommands.forEach(function(internalCommand) {
    proxy.before(mongodb.Db.prototype, internalCommand, function(obj, args) {
      var command = args[0] || {};
      var options = args[1] || {};

      var cmd = commandMap[internalCommand];
      var collectionName = command.collectionName;
      var q = JSON.stringify(sanitize(command.query || command.spec || {}));
      var fullQuery = collectionName + '.' + cmd + '(' + q + ')';

      var timer = samples.timer("MongoDB", commandMap[internalCommand]);

      var callbackIndex = args.length - 1;
      while (callbackIndex >= 0 && typeof(args[callbackIndex]) !== 'function') {
        callbackIndex -= 1;
      }

      var graphNode = graphHelper.startNode('MongoDB', fullQuery, agent);
      counts.sample('mongodb');

      if (callbackIndex === -1) {
        // updates and inserts are fire and forget unless safe is set
        // record these in top functions, just for tracking
        topFunctions.add('mongoCalls', fullQuery, 0);
        tiers.sample(tier + '_in', timer);
      } else {
        proxy.callback(args, callbackIndex,
                       function(obj, args, extra, graph, currentNode) {
          timer.end();
          topFunctions.add('mongoCalls', fullQuery, timer.ms);

          recordExtra(extra, timer);

          graphHelper.updateTimes(graphNode, timer);
        });
      }

      if (graphNode) agent.currentNode = graphNode.prevNode;
    });
  });  // all commands
};     // require mongo
