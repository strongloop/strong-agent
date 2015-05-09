'use strict';

if (process.platform !== 'linux') {
  console.log('ok # SKIP Linux-only feature');
  return;
}

var agent = require('../');
var assert = require('assert');

var t = agent.internal.lrtime();
assert(Array.isArray(t));
assert(t[0] > 0);
assert(t[1] >= 0);
assert(t[1] <= 999999999);
