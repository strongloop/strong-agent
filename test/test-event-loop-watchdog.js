if (process.platform !== 'linux') {
  console.log('1..0 # SKIP watchdog is Linux-only for now');
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

profiler.start();
profiler.start();  // Idempotent but adds another sample.
profiler.start(1);  // Idempotent but adds another sample.
assert(hitCount(profiler.stop()) >= 3);  // May also contain normal samples.
assert.equal(profiler.stop(), undefined);

profiler.start(1 << 30);
profiler.start();  // Idempotent but adds another sample.
profiler.start(1);  // Idempotent but adds another sample.
delay(25);

// The profiler synchronously collects a sample when it is started but is
// otherwise suspended.  That means the profile should contain exactly
// the three samples we added manually.
var count = hitCount(profiler.stop());
if (/^3.14/.test(process.versions.v8)) {
  assert(count > 0);  // Unreliable with joyent/node v0.10.
} else {
  assert.equal(count, 3);
}
assert.equal(profiler.stop(), undefined);

profiler.start(1);
profiler.start();  // Idempotent.
profiler.start(1337);  // Idempotent.
delay(25);

assert(hitCount(profiler.stop()) > 1);
assert.equal(profiler.stop(), undefined);

agent.metrics.startCpuProfiling(1000);
delay(25);
assert.equal(hitCount(JSON.parse(agent.metrics.stopCpuProfiling()).head), 1);

agent.metrics.startCpuProfiling(1);
delay(25);
assert(hitCount(JSON.parse(agent.metrics.stopCpuProfiling()).head) > 1);
