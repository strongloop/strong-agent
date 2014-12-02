process.env.SL_ENV = '';
process.env.STRONGLOOP_LICENSE = '';
var agent = require('../');
var assert = require('assert');

agent.profile('some app', 'some key');
assert.throws(function() { agent.metrics.startCpuProfiling(42) }, /license/i);
