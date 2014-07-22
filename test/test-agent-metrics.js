// Use 50 ms intervals for metrics collection.
process.env.STRONGAGENT_INTERVAL_MULTIPLIER = 20;
process.env.SL_ENV = 'test';

var metrics = [];
var messages = [];
var logger = {
  log: messages.push.bind(messages),
  info: messages.push.bind(messages),
  error: messages.push.bind(messages),
};

var agent = require('../');
agent.profile('some key', null, { logger: logger });
agent.use(metrics.push.bind(metrics));

var assert = require('assert');
var counts = require('../lib/counts');
var http = require('http');

assert.equal(typeof(gc), 'function', 'Run this test with --expose_gc');
http.createServer(onrequest).listen(0, onlisten);

counts.init(agent, 50);
for (var i = 0; i < 7; i += 1) counts.sample('strongmq_in');
for (var i = 0; i < 13; i += 1) counts.sample('strongmq_out');

function onrequest(req, res) {
  res.writeHead(200, { 'Content-Length': '32' });
  res.end(Buffer(32));
}

function onlisten() {
  var server = this;
  var address = server.address().address;
  var port = server.address().port;
  function done() { setTimeout(server.close.bind(server), 50) }
  function next() { pummel(address, port, --next.rounds > 0 ? next : done) }
  next.rounds = 32;
  next();
}

function pummel(host, port, next) {
  http.get({ host: host, port: port }, function(res) {
    res.on('end', next);
    res.on('end', gc);
    res.resume();
  });
}

process.on('exit', function() {
  assert.equal(metrics.length % 2, 0);
  var keys = metrics.filter(function(_, i) { return i % 2 === 0 });
  function has(key) {
    return keys.indexOf(key) !== -1;
  }
  function count(key) {
    return keys.filter(function(k) { return k == key }).length;
  }
  function values(key) {
    var elts = [];
    for (var i = 0; i < metrics.length; i += 2) {
      if (metrics[i] === key) elts.push(metrics[i + 1]);
    }
    return elts;
  }
  assert(has('heap.used'));
  assert(has('heap.total'));
  assert(has('http.connection.count'));
  assert(has('gc.heap.used'));
  assert(has('tiers.http.average'));
  assert(has('loop.count'));
  assert(has('loop.minimum'));
  assert(has('loop.maximum'));
  assert(has('loop.average'));
  assert.notEqual(values('http.connection.count').length, 0);
  assert.equal(count('messages.in.count'), 1);
  assert.equal(count('messages.out.count'), 1);
  assert.equal(metrics[1 + 2 * keys.indexOf('messages.in.count')], 7);
  assert.equal(metrics[1 + 2 * keys.indexOf('messages.out.count')], 13);
  assert(messages.length > 0);
});
