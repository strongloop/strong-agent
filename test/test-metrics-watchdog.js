'use strict';

process.env.STRONGLOOP_LICENSE = '';
process.env.HOME = '/no/such/home/dir';
var agent = require('../');
var assert = require('assert');

agent.profile('some app', 'some key');
assert.throws(function() { agent.metrics.startCpuProfiling(42) }, /license/i);
