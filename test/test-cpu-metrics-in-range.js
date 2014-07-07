var assert = require('assert');
var cpuinfo = require('../lib/cpuinfo');

// cpuutil() takes at least a second to generate data.
setTimeout(check, 1000);
setTimeout(check, 2000);

function check() {
  cpuinfo.cpuutil(function(p, u, s) {
    console.log([p, u, s]);
    assert(p >= 0);
    assert(p <= 100);
    assert(u >= 0);
    assert(u <= 100);
    assert(s >= 0);
    assert(s <= 100);
  });
}
