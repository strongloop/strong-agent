'use strict';

process.env.STRONGLOOP_LICENSE = require('./helpers').shortTestLicense();
require('../lib/config').baseInterval = 100;

var agent = require('../');
agent.profile('deadbeef', 'deadbeef', {quiet: true});

var EventEmitter = require('events').EventEmitter;
var assert = require('assert');
var path = require('path');

var updates = [];
agent.on('topCalls', updates.push.bind(updates));

function Connection() {}
Connection.prototype.query = function(_, cb) { setImmediate(cb); };

function Collection() {}
Collection.prototype.find = function(_, cb) { setImmediate(cb); };

var mongodb = {Collection: Collection};
require.cache['mongodb'] = {exports: mongodb};
require('../lib/probes/mongodb')(mongodb);

// The mysql probe loads lib/Connection.js ahead of time.
var filename = path.join('/mysql', 'index.js');
function fakeRequire(filename) { return Connection; }
fakeRequire.cache = { mysql: { exports: {}, filename: filename } };
require('../lib/probes/mysql')(fakeRequire.cache.mysql.exports, fakeRequire);

function once() {
  var numcalls = 0;
  process.once('exit', function() { assert.equal(numcalls, 1); });
  return function() { numcalls += 1; };
}

var server = require('http').createServer();
server.on('request', function(req, res) {
  req.once('data', function() {
    (new Connection).query('SELECT 1', once());
    (new Collection).find({collectionName: 'x'}, once());
  });
});

var req = new EventEmitter;
var res = new EventEmitter;
req.url = '/xyzzy';
res.end = function() {};

var on = req.on;
server.emit('request', req, res);
assert.equal(req.on, on);  // Should not have been monkey-patched.

setImmediate(function() {
  req.emit('data');
  res.end();
});

process.once('exit', function() {
  agent.poll();
  assert.equal(updates.length, 1);
  // Verify that mongodb/mysql queries are associated with the HTTP request.
  var list = updates[0].httpCalls.list[0];
  var tiers = list[3];
  assert(tiers.mongodb > 0);
  assert(tiers.mysql > 0);
  assert(tiers.closed);
  var nodes = list[4].nodes;
  assert.equal(nodes[0].name, '/xyzzy');
  assert.equal(nodes[1].name, 'MySQL');
  assert.equal(nodes[1].q, 'SELECT 1');
  assert.equal(nodes[2].name, 'MongoDB');
  assert.equal(nodes[2].q, 'find({"collectionName":"x"})');
  var links = list[4].links;
  assert.equal(links[0].value, nodes[1].value);
  assert.equal(links[0].value, updates[0].mysqlCalls.list[0][2]);
  assert.equal(links[1].value, nodes[2].value);
  assert.equal(links[1].value, updates[0].mongoCalls.list[0][2]);
});
