var addon = require('../lib/addon');
var agent = require('../');
var assert = require('assert');

if (addon == null) {
  console.log('Skipping test, no add-on found.');
  return;
}

if (addon.stopCpuProfilingAndSerialize == null) {
  console.log('Skipping test, CPU profiler metrics not supported.');
  return;
}

assert.equal(agent.metrics.startCpuProfiling(), null);
assert.deepEqual(Object.keys(JSON.parse(agent.metrics.stopCpuProfiling())),
                 ['head', 'startTime', 'endTime', 'samples']);
assert.throws(agent.metrics.stopCpuProfiling, /profiler not started/);
assert.equal(addon.stopCpuProfilingAndSerialize(), undefined);

assert.equal(agent.metrics.startCpuProfiling(), null);
for (var buf = Buffer(1 << 20), i = 1; i < buf.length; i += 1) {
  buf[i] ^= buf[i - 1];
}
var json = agent.metrics.stopCpuProfiling();
var profile = JSON.parse(json);
assert.deepEqual(Object.keys(profile),
                 ['head', 'startTime', 'endTime', 'samples']);
verifyNode(profile.head);
profile.samples.forEach(function(sample) {
  assert.equal(typeof(sample), 'number');
  assert.equal(sample, sample | 0);
});

function verifyNode(node) {
  assert.deepEqual(Object.keys(node), [
    'functionName',
    'scriptId',
    'url',
    'lineNumber',
    'columnNumber',
    'hitCount',
    'callUID',
    'children',
    'deoptReason',
    'id'
  ]);
  assert.equal(typeof(node.functionName), 'string');
  assert.equal(typeof(node.scriptId), 'string');  // Chrome quirk.
  assert.equal(typeof(node.url), 'string');
  assert.equal(typeof(node.lineNumber), 'number');
  assert.equal(typeof(node.columnNumber), 'number');
  assert.equal(typeof(node.hitCount), 'number');
  assert.equal(typeof(node.callUID), 'number');
  assert.equal(Array.isArray(node.children), true);
  assert.equal(typeof(node.deoptReason), 'string');
  assert.equal(typeof(node.id), 'number');
  assert.equal(node.lineNumber, node.lineNumber | 0);
  assert.equal(node.columnNumber, node.columnNumber | 0);
  assert.equal(node.hitCount, node.hitCount | 0);
  // callUID is not necessarily in the range -2,147,483,648 to 2,147,483,647.
  assert.equal(node.id, node.id | 0);
  node.children.forEach(verifyNode);
}
