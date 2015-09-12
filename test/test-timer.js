'use strict';

var Timer = require('../lib/timer');
var assert = require('assert');

// Timer module should be clobber-safe.
process.hrtime = Math.round = function() { throw 'BAM' };

var timer = new Timer;

timer.start();
setTimeout(function() {
  timer.end();
  assert(timer.ms > 0);
});
