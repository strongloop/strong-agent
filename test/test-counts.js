var assert = require('assert');
var counts = require('../lib/counts');
var config = require('../lib/config');

function emit(name, data) {
  if (data.one) {
    emit.one += 1;
    assert.equal(data.one, 1);
  }
  if (data.two) {
    emit.two += 1;
    assert.equal(data.two, 2);
  }
  if (data.three) {
    emit.three += 1;
    assert.equal(data.three, 3);
  }
}
emit.one = 0;
emit.two = 0;
emit.three = 0;

var agent = {internal: {emit: emit}};
counts.init(agent, 1e1);

function spam() {
  counts.sample('one');
  counts.sample('two');
  counts.sample('two');
  counts.sample('three');
  counts.sample('three');
  counts.sample('three');
  if (--spam.ticks > 0) setTimeout(spam, 25);
}
spam.ticks = 3;

process.on('exit', function() {
  // Timeouts are never too precise so let's not have too high or too exact
  // expectations, just expect that we've seen _some_ events.
  assert(emit.one > 1);
  assert(emit.two > 1);
  assert(emit.three > 1);
});

setTimeout(function() {}, 100);
spam();
