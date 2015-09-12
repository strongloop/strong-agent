'use strict';

var agent = require('../agent');
var proxy = require('../proxy');
var samples = require('../samples');
var counts = require('../counts');
var tiers = require('../tiers');
var topFunctions = require('../top-functions');
var graphHelper = require('../graph-helper');

exports = module.exports = memcached;
exports.getCommandAndKey = getCommandAndKey;

var commands = [
  'get',
  'gets',
  'getMulti',
  'set',
  'replace',
  'add',
  'cas',
  'append',
  'prepend',
  'increment',
  'decrement',
  'incr',
  'decr',
  'del',
  'delete',
  'version',
  'flush',
  'samples',
  'slabs',
  'items',
  'flushAll',
  'samplesSettings',
  'samplesSlabs',
  'samplesItems',
  'cachedump'
];

function memcached(memcached) {

  commands.forEach(function(command) {
    proxy.before(memcached.prototype, command, function(client, args) {
      if (agent.paused) return;

      // ignore, getMulti will be called
      if (command === 'get' && Array.isArray(args[0])) return;

      var timer = samples.timer("Memcached", command);
      var graphNode = graphHelper.startNode('Memcached', command, agent);
      counts.sample('memcached');

      var query = command + ' ' + args[0];

      function strongTraceTransaction(query, callback){
        var linkName = "Memcached " + query;
        return agent.transactionLink(linkName, callback);
      }

      function handle (obj, args, extra) {
        timer.end();

        topFunctions.add('memcacheCalls', query, timer.ms);
        graphHelper.updateTimes(graphNode, timer);
        if (extra) {
          extra.memcached = extra.memcached || 0;
          extra.memcached += timer.ms;
          if (extra.closed) {
            tiers.sample('memcached_out', timer);
          } else {
            tiers.sample('memcached_in', timer);
          }
        } else {
          tiers.sample('memcached_in', timer);
        }
      }

      proxy.callback(args, -1,
        strongTraceTransaction(getCommandAndKey(command, args), handle));

      if (graphNode) agent.currentNode = graphNode.prevNode;
    });
  });
};

function getCommandAndKey(command, args) {
  var keyValue = '';
  if (typeof args[0] === 'string') keyValue += ' "' + args[0] + '"';
  if (typeof args[1] === 'string') keyValue += ' "' + args[1] + '"';
  return command + keyValue;
};
