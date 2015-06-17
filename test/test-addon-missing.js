'use strict';

var addon = require('../lib/addon');
require.cache[require.resolve('../lib/addon')].exports = null;

var agent = require('../');
var assert = require('assert');

agent.start();
agent.on('poll::start', function() { numevents += 1; });
setImmediate(agent.poll.bind(agent));

var numevents = 0;
process.on('exit', function() { assert.equal(numevents, 1); });
