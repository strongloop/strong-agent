'use strict';

var assert = require('assert');
var agent = require('../').profile('key', 'name');

assert.doesNotThrow(function () {
  var nullModule = require('./fixtures/null');
  assert.equal(nullModule, null);
}, /.*/, 'Should not die when module.exports === null');
