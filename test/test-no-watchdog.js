var addon = require('../lib/addon');
var agent = require('../');
var assert = require('assert');
var profiler = require('../lib/profilers/cpu');

if (process.platform === 'darwin' || process.platform === 'linux') {
  addon.startCpuProfiling = function(timeout) { if (timeout) return 'BAM'; };
}

agent.profile('some app', 'some key');
profiler.start();
profiler.stop();
assert.throws(function() { profiler.start(42, 42); });
