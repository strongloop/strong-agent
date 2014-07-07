// Regression test to ensure that a default config is loaded when an unknown
// environment name is used.
process.env.SL_ENV = 'bad';

var assert = require('assert');
var config = require('../lib/config');

assert(config);
assert(config.collector);
