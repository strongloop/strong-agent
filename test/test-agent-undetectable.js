'use strict';

var agent = require('../');
var assert = require('assert');

assert.equal('STRONGAGENT' in global, true);  // Alas.
assert.equal(Object.keys(global).indexOf('STRONGAGENT'), -1);
assert.equal(typeof(global.STRONGAGENT), 'undefined');
assert.equal(typeof(global.STRONGAGENT.profile), 'function');
