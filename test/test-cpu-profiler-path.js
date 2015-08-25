var agent = require('../');
var assert = require('assert');
var vm = require('vm');

var v8 = process.versions.v8.split('.').slice(0, 3).reduce(function(a, b) {
  return a = a << 8 | b;
});

if (v8 < 0x31D00) {  // V8 < 3.29
  return;  // Known buggy version of V8, skip test.
}

function busy() {
  var start = Date.now();
  while (Date.now() < start + 250);
}

try {
  agent.metrics.startCpuProfiling();
} catch (e) {
  return;  // Skip, not supported for this node version.
}

var filename = 'C:\\Program Files\\node\\test.js';
vm.runInThisContext(busy + 'busy()', filename);
var data = agent.metrics.stopCpuProfiling();
var root = JSON.parse(data);  // Should not throw.

function recurse(node) {
  // The .slice(2) is because V8 strips the "C:" prefix...
  if (node.url === filename.slice(2)) return true;
  return node.children.some(recurse);
}
assert(recurse(root.head));
