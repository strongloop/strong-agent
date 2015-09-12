'use strict';

var agent = require('../agent');
var proxy = require('../proxy');
var samples = require('../samples');
var topFunctions = require('../top-functions');
var counts = require('../counts');
var tiers = require('../tiers');
var graphHelper = require('../graph-helper');

exports = module.exports = oracledb;
exports.oracleBase = oracleBase;

function oracledb(oracle) {
  oracleBase(oracle, 'getConnection', 'getConnection', 'Oracledb');
}

function oracleBase(oracle, connSyncCmd, connCmd, linkName) {

  proxy.after(oracle, connSyncCmd, function(obj, args, connection) {
    proxy_connection(connection, linkName);
  });

  proxy.before(oracle, connCmd, function(obj, args) {

    agent.strongTraceLink(linkName, connCmd, args);
    proxy.callback(args, -1, function (obj, args) {
      var connection = args[1];
      proxy_connection(connection, linkName);
    });
  });
}

function proxy_connection(connection, linkName) {
  if (!connection) return;

  proxy.around(
      connection, 'executeSync',
      // before
      function(obj, args, locals) { query_before(args, locals, linkName); },
      // after
      function(obj, args, ret, locals) { query_after(locals); });

  proxy.before(connection, ['execute'], function(obj, args) {
    // query starts
    var locals = {};
    query_before(args, locals, linkName);

    proxy.callback(args, -1, function(obj, args) {
      // query ends
      query_after(locals);
    });
  });

  ['commit', 'rollback'].forEach(function(method) {
    proxy.before(connection, method, function(obj, args) {
      // query starts
      var locals = {command: method};
      query_before(args, locals, linkName);
      proxy.callback(args, -1, function(obj, args, extra) {
        // query ends
        query_after(locals, extra);
      });
    });
  });
}

function query_before(args, locals, linkName) {
  locals.command = locals.command || (args.length > 0 ? args[0] : undefined);
  locals.timer = samples.timer('Oracle', 'query');
  locals.graphNode = graphHelper.startNode('Oracle', locals.command, agent);
  if (locals.graphNode) {
    agent.currentNode = locals.graphNode.prevNode;
  }
  counts.sample('oracle');
  agent.strongTraceLink(linkName, locals.command, args);
}

function query_after(locals, extra) {
  var tier = extra && extra.closed ? 'oracle_out' : 'oracle_in';
  locals.timer.end();
  topFunctions.add('oracleCalls', locals.command, locals.timer.ms);
  graphHelper.updateTimes(locals.graphNode, locals.timer);
  tiers.sample(tier, locals.timer);
}
