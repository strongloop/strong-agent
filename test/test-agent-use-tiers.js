process.env.STRONGLOOP_LICENSE = require('./helpers').shortTestLicense();

var EventEmitter = require('events').EventEmitter;
var agent = require('../');
var tap = require('tap');

var uses = new EventEmitter;

agent.configure({
  // these tests manually inject metrics, so we want a long
  // interval to prevent the _real_ metrics from interfering
  interval: 30000
});

agent.use(uses.emit.bind(uses, 'use'));

// XXX These tests assume the .average is the first value sent out
var tests = {
  'redis_out': 'tiers.redis.average',
  'http': 'http.average',
  'foo.bar.com:8080_out': 'tiers.foo.bar.com:8080.average',
  'www.random.org_out': 'tiers.www.random.org.average',
  '127.0.0.1_out': 'tiers.127.0.0.1.average',
};

for (var k in tests) {
  makeTest(k, tests[k]);
}

function makeTest(tier, metric) {
  tap.test(tier, function(t) {
    var update = {
      tiers: {},
    };
    update.tiers[tier] = {
      min: 0,
      max: 2,
      avg: 1
    };

    t.plan(1);
    uses.once('use', function(name, value) { t.equal(name, metric); });
    agent.internal.emit('i::send', 'update', update);
  });
}
