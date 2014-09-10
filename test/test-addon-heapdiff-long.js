// This test is mostly a reminder to self that while it's possible to create
// variable or function names > 1024 characters, the V8 heap profiler will
// only track the first 1024.

var assert = require('assert');
var addon = require('../lib/addon');

var s = Array(1 << 16).join('A');
var f = eval('function ' + s + '() {} ' + s);
assert.equal(f.name, s);

addon.startHeapDiff();
global.retain = new f;

var changes = addon.stopHeapDiff(true).filter(
    function(e) { return e.type.slice(0, 7) === 'AAAAAAA'; });
assert.equal(changes.length, 1);
assert.equal(changes[0].type, Array(1024 + 1).join('A'));
