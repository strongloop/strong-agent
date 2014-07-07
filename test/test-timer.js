var Timer = require('../lib/timer');
var assert = require('assert');

// Timer module should be clobber-safe.
process.hrtime = Math.round = function() { throw 'BAM' };

var timer = new Timer;
assert(timer.micro() > 0);

timer.start();
setTimeout(function() {
  timer.end();
  assert(timer.ms > 0);
});
