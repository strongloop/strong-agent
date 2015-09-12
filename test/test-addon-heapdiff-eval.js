// The presence of eval() in a script upsets the heap snapshot generator
// in v0.10.  It's not that the nodes aren't there, it's that they get
// represented in a different way.  In particular, it's crucial that
// v8::HeapGraphNode::kHidden nodes are followed.

'use strict';

var assert = require('assert');
var addon = require('../lib/addon');
assert(addon, 'Native add-on not found.');

addon.startHeapDiff();
var t = Array(1 << 16).join('.').split('').map(function() { return new Array });
var changes = addon.stopHeapDiff(true);
assert(changes.length > 0);
eval('');
