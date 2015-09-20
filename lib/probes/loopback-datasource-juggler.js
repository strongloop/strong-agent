'use strict';

var agent = require('../agent');
var samples = require('../samples');
var tiers = require('../tiers');
var proxy = require('../proxy');
var extend = require('util')._extend;
var topFunctions = require('../top-functions');

var commands = {
  create: 'create',
  findOrCreate: 'find_or_create',
  exists: 'exists',
  find: 'find',
  findById: 'find_by_id',
  remove: 'remove',
  removeById: 'remove_by_id',
  count: 'count'
};

var instanceCommands = {
  save: 'save',
  remove: 'remove',
  updateAttribute: 'update_attribute',
  updateAttributes: 'update_attributes',
  reload: 'reload'
};

module.exports = function(juggler) {
  var dao = juggler.Schema.DataAccessObject;

  function createPatcher(obj) {
    return function patch(command) {
      var _old = dao[command];
      proxy.before(obj, command, function(obj, args) {
        if (args.length === 0 ||
            typeof args[args.length - 1] !== 'function') {
          // TODO(bnoordhuis) loopback-datasource-juggler methods return
          // promises when the callback is omitted.  We don't yet support
          // instrumenting those.
          return;
        }
        var cmd = commands[command];
        agent.strongTraceLink('DAO', command, args);
        var timer = samples.timer('DataAccessObject', cmd);
        proxy.callback(args, -1,
                       function(obj, args, extra, graph, currentNode) {
          timer.end();
          topFunctions.add('jugglerCall', command, timer.ms);
          if (extra) {
            extra.dao = extra.dao || 0;
            extra.dao += timer.ms;
            if (extra.closed) {
              tiers.sample('dao_out', timer);
            } else {
              tiers.sample('dao_in', timer);
            }
          } else {
            tiers.sample('dao_in', timer);
          }
        });
      });
      extend(dao[command], _old);
    };
  }

  Object.keys(commands).forEach(createPatcher(dao));
  Object.keys(instanceCommands).forEach(createPatcher(dao.prototype));
};
