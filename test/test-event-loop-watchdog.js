if (process.platform !== 'darwin' && process.platform !== 'linux') {
  console.log('1..0 # SKIP watchdog is Linux- and OS X-only for now');
  return;
}

if (process.versions.v8 >= '3.15' && process.versions.v8 < '3.29') {
  console.log('1..0 # SKIP watchdog is incompatible with this node version');
  return;
}

process.env.STRONGLOOP_LICENSE = require('./helpers').longTestLicense();

var addon = require('../lib/addon');
var agent = require('../');
var assert = require('assert');
var profiler = require('../lib/profilers/cpu');

var watchdogActivationCountEvents = 0;
var watchdogActivationCount = 0;

process.once('exit', function() {
  agent.poll();
  assert(watchdogActivationCountEvents > 0);
  assert(watchdogActivationCount > 0);
});

agent.profile('some app', 'some key');
agent.use(function(key, value) {
  if (key !== 'watchdog.activations.count') return;
  watchdogActivationCountEvents += 1;
  watchdogActivationCount += value;
});

function hitCount(node) {
  if (typeof(node.totalSamplesCount) === 'number') {
    return node.totalSamplesCount;
  }
  var n = node.hitCount | 0;
  if (node.children) {
    node.children.forEach(function(node) { n += hitCount(node) });
  }
  return n;
}

function delay(ms) {
  var start = Date.now();
  while (Date.now() < start + ms);
}

profiler.start(1 << 30);
delay(25);
assert.equal(hitCount(profiler.stop()), 0);

profiler.start(1);
delay(25);
assert(hitCount(profiler.stop()) > 1);
assert.equal(profiler.stop(), undefined);

agent.metrics.startCpuProfiling(1000);
delay(25);
assert.equal(hitCount(JSON.parse(agent.metrics.stopCpuProfiling()).head), 0);

agent.metrics.startCpuProfiling(1);
delay(25);
assert(hitCount(JSON.parse(agent.metrics.stopCpuProfiling()).head) > 1);
