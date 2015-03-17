// Use 100 ms intervals for metrics collection.
process.env.STRONGAGENT_INTERVAL_MULTIPLIER = 10;
process.env.SL_ENV = 'test';
var helpers = require('./helpers');
process.env.STRONGLOOP_LICENSE = helpers.shortTestLicense();

var metrics = [];
var messages = [];
var logger = {
  log: messages.push.bind(messages),
  info: messages.push.bind(messages),
  warn: messages.push.bind(messages),
  error: messages.push.bind(messages),
};

var agent = require('../');
agent.profile('some key', null, {logger: logger});
agent.use(metrics.push.bind(metrics));

var assert = require('assert');
var counts = require('../lib/counts');
var http = require('http');

assert.equal(typeof(gc), 'function', 'Run this test with --expose_gc');
http.createServer(onrequest).listen(0, '127.0.0.1', onlisten);

for (var i = 0; i < 7; i += 1) counts.sample('strongmq_in');
for (var i = 0; i < 13; i += 1) counts.sample('strongmq_out');

function onrequest(req, res) {
  res.writeHead(200, {'Content-Length': '32'});
  res.end(Buffer(32));
}

function onlisten() {
  var server = this;
  var address = server.address().address;
  var port = server.address().port;
  function done() { setTimeout(server.close.bind(server), 100) }
  function next() { pummel(address, port, --next.rounds > 0 ? next : done) }
  next.rounds = 32;
  next();
}

function pummel(host, port, next) {
  http.get({host: host, port: port}, function(res) {
    res.on('end', next);
    res.on('end', gc);
    res.resume();
  });
}

process.on('exit', function() {
  assert.equal(metrics.length % 2, 0);
  var keys = metrics.filter(function(_, i) { return i % 2 === 0 });
  function values(key) {
    var elts = [];
    for (var i = 0; i < metrics.length; i += 2) {
      if (metrics[i] === key) elts.push(metrics[i + 1]);
    }
    return elts;
  }
  var expected = [ 'gc.heap.used',
                   'heap.total',
                   'heap.used',
                   'http.average',
                   'http.connection.count',
                   'http.maximum',
                   'http.minimum',
                   'loop.average',
                   'loop.count',
                   'loop.maximum',
                   'loop.minimum',
                   'messages.in.count',
                   'messages.out.count' ];
  expected.forEach(function(key) {
    var samples = values(key);
    assert.notEqual(samples.length, 0);
    // Verify that all values are >= 0 and not NaN.  http.connection.count is
    // exempt because it represents the change in connections since the last
    // sample and thus can be < 0 if more client connections were closed than
    // opened.
    if (key === 'http.connection.count') {
      assert(samples.every(function(v) { return v === +v; }));
    } else {
      assert(samples.every(function(v) { return v === +v && v >= 0; }));
    }
  });
  assert.equal(values('messages.in.count').length, 1);
  assert.equal(values('messages.out.count').length, 1);
  assert.equal(metrics[1 + 2 * keys.indexOf('messages.in.count')], 7);
  assert.equal(metrics[1 + 2 * keys.indexOf('messages.out.count')], 13);
  assert(messages.length > 0);
});
