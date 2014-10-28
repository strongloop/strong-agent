var assert = require('assert');
var addon = require('../lib/addon');
assert(addon, 'Native add-on not found.');

addon.startHeapDiff();
assert(addon.stopHeapDiff() === undefined);

addon.startHeapDiff();
assert(addon.stopHeapDiff(false) === undefined);

addon.startHeapDiff();
assert(addon.stopHeapDiff(true) instanceof Array);

// +1 because older V8 versions count the function as an object instance too.
var maybeAddOne = Number(process.versions.v8 <= '3.28.');

addon.startHeapDiff();
function Quux() {}
var t = Array(1 << 16).join('.').split('').map(function() { return new Quux });
var changes = addon.stopHeapDiff(true);
var change = changes.filter(function(e) { return e.type === 'Quux' })[0];
assert.equal(change.total, t.length + maybeAddOne);
// Ball park figure, the real multiplier is more like 12 on x86 and 24 on x64
// but that's relying on V8's internal representation too much.
assert(change.size >= 8 << 16);

addon.startHeapDiff();
var name = Array(1 << 16).join('Z');
var clazz = eval('function ' + name + '() {} ' + name);
var t = Array(1 << 16).join('.').split('').map(function() { return new clazz });
var changes = addon.stopHeapDiff(true);
// Class name gets capped at 4096 bytes at the time of this writing to avoid
// excessive memory usage.
var change = changes.filter(function(e) { return !e.type.indexOf('ZZZZZ') })[0];
assert(change.type.length < name.length);
// Doesn't work in node.js v0.10: V8 3.14 only reports a subset of the nodes
// when the heap is full and no amount of calling gc() first will fix that...
if (process.version.indexOf('v0.10.') !== 0) {
  assert(change.total === t.length + maybeAddOne);
  assert(change.size >= 8 << 16);
}
