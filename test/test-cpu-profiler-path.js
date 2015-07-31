var agent = require('../');
var assert = require('assert');
var vm = require('vm');

// If watchdog mode is supported, we're not using V8's CPU profiler.
if (agent.internal.supports.watchdog === false) {
  var v8 = process.versions.v8.split('.').slice(0, 3).reduce(function(a, b) {
    return a = a << 8 | b;
  });

  if (v8 >= 0x30F00 && v8 < 0x31D00) {  // V8 >= 3.15 && < 3.29
    return console.log('1..0 # SKIP known buggy V8', process.versions.v8);
  }
}

function busy() {
  var start = Date.now();
  while (Date.now() < start + 250);
}

try {
  agent.metrics.startCpuProfiling();
} catch (e) {
  return console.log('1..0 # SKIP', e.message);
}

var filename = 'C:\\Program Files\\node\\test.js';
vm.runInThisContext(busy + 'busy()', filename);
var data = agent.metrics.stopCpuProfiling();
var root = JSON.parse(data);  // Should not throw.

function recurse(node) {
  if (node.url === filename) return true;
  // The .slice(2) is because V8 strips the "C:" prefix...
  // TODO(bnoordhuis) Remove this when we no longer use the V8 profiler.
  if (node.url === filename.slice(2)) return true;
  return node.children.some(recurse);
}
assert(recurse(root.head));
