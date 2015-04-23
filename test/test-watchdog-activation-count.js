if (process.platform !== 'linux') {
  console.log('ok # SKIP watchdog is Linux-only for now');
  return;
}

if (process.versions.v8 >= '3.15' && process.versions.v8 < '3.29') {
  console.log('ok # SKIP watchdog is incompatible with this node version');
  return;
}

process.env.SL_ENV = 'dev';
process.env.STRONGLOOP_LICENSE = require('./helpers').longTestLicense();

var addon = require('../lib/addon');
var agent = require('../');
var assert = require('assert');
var profiler = require('../lib/profilers/cpu');

var watchdogActivationCountEvents = 0;
var watchdogActivationCount = 0;

process.once('exit', function() {
  assert(watchdogActivationCountEvents >= 1);
  assert(watchdogActivationCount >= 10);
});

agent.profile('some app', 'some key');
agent.internal.once('watchdogActivationCount', function(count) {
  watchdogActivationCountEvents += 1;
  watchdogActivationCount += count;
});

profiler.start(1);
block(10);

function block(count) {
  if (count <= 0) return done();
  delay(25);
  setImmediate(block.bind(null, count - 1));
}

function done() {
  profiler.stop();
  agent.poll();
}

function delay(ms) {
  var start = Date.now();
  while (Date.now() < start + ms);
}
