'use strict';

// test array form of profile()'s appName argument
var assert = require('assert');
var defaults = require('../lib/config');
var config = defaults.configure(null, ['june', 'leonie'], {}, {});
assert.equal(config.appName, 'june');
assert.equal(config.hostname, 'leonie');
