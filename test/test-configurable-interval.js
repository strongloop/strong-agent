var assert = require('assert');
var helpers = require('./helpers');
// longest default interval is production, so if the .configure()
// doesn't work, the interval used should fail the below tests
process.env.SL_ENV = 'prod';
var agent = require('../');

assert(!agent.started, 'agent is not running');
agent.configure({ interval: 500, license: helpers.shortTestLicense() });

var collected = 0;
function tick() {
  collected += 1;
}

agent.use(tick);
assert(agent.started, 'agent is running');

var counted = 0;
setTimeout(function() {
  assert.strictEqual(collected, 0, 'nothing reported half way');
  counted += 1;
}, 250);

setTimeout(function() {
  assert(collected > 0, 'something reported after a cycle');
  // basics: 2 heap, 4 loop, 3 cpu
  assert(collected < 10, 'only one cycle worth reported in a cycle');
  counted += 1;
}, 750);


process.on('exit', function(code) {
  assert(code === 0);
  assert(counted === 2, 'collection counts verified twice');
});
