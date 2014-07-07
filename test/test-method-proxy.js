'use strict';

var assert = require('assert');
var proxy = require('../lib/proxy');
var kContextPropertyName = '__STRONGOPS_CONTEXT__';

// Assorted sanity checks.
(function() {
  var o = { f: fun, g: fun };

  function fun() {
    assert.equal(this, o);
    fun.calls += 1;
  }
  fun.calls = 0;

  function hook(target, args) {
    assert.equal(target, o);
    hook.calls += 1;
  }
  hook.calls = 0;

  assert.equal(o.f, o.g);
  proxy.before(o, 'f', hook);
  assert.notEqual(o.f, fun);  // Sadly enough. :-(
  assert.notEqual(o.g, fun);
  assert.equal(o.f, o.g);

  var des = Object.getOwnPropertyDescriptor(o, 'f');
  assert.equal(des.value[kContextPropertyName].target, fun);
  assert.equal(des.value.name, 'fun');

  var des = Object.getOwnPropertyDescriptor(o, 'g');
  assert.equal(des.value[kContextPropertyName].target, fun);
  assert.equal(des.value.name, 'fun');

  var des = Object.getOwnPropertyDescriptor(o.f, 'toString');
  assert.equal(des.configurable, true);
  assert.equal(des.enumerable, false);
  assert.equal(des.writable, true);

  assert.equal(o.f.toString(), fun.toString());
  assert.equal(o.g.toString(), fun.toString());

  var t = o.f;
  proxy.before(o, 'f', hook);
  assert.equal(o.f, t);
  assert.equal(o.g, t);
  assert.equal(o.f, o.g);

  assert.equal(fun.calls, 0);
  assert.equal(hook.calls, 0);
  o.f();
  assert.equal(fun.calls, 1);
  assert.equal(hook.calls, 1);
  o.g();
  assert.equal(fun.calls, 2);
  assert.equal(hook.calls, 2);

  function bar() { bar.calls += 1 }
  bar.calls = 0;

  var t = o.g;
  assert.equal(o.f, o.g);
  o.f = bar;
  assert.notEqual(o.f, o.g);
  assert.equal(o.f, bar);
  assert.equal(o.g, t);
  assert.equal(bar.calls, 0);
  assert.equal(fun.calls, 2);
  o.f();
  assert.equal(bar.calls, 1);
  assert.equal(fun.calls, 2);
  o.g();
  assert.equal(bar.calls, 1);
  assert.equal(fun.calls, 3);

  function baz() { baz.calls += 1 }
  baz.calls = 0;

  o.g = baz;
  assert.equal(o.g, baz);
  assert.equal(baz.calls, 0);
  assert.equal(fun.calls, 3);
  o.g();
  assert.equal(baz.calls, 1);
  assert.equal(fun.calls, 3);
})();

// Ensure that proxy function carries function metadata
(function() {
  var o = {
    f: fun
  };

  function fun() {
    assert.equal(this, o);
    fun.calls += 1;
  }
  fun.calls = 0;

  function hook(target, args) {
    assert.equal(target, o);
    hook.calls += 1;
  }
  hook.calls = 0;

  Object.defineProperty(o.f, 'funcPropA', {
    configurable: true,
    enumerable: false,
    writable: true,
    value: 'funcPropAValue',
  });

  var desc = Object.getOwnPropertyDescriptor(o.f, 'funcPropA');

  assert.equal(o.f, fun); // original function
  proxy.before(o, 'f', hook);
  assert.notEqual(o.f, fun); // wrapped function

  var newDesc = Object.getOwnPropertyDescriptor(o.f, 'funcPropA')
  assert.equal(desc.value, newDesc.value);
  assert.equal(desc.writable, newDesc.writable);
  assert.equal(desc.enumerable, newDesc.enumerable);
  assert.equal(desc.configurable, newDesc.configurable);
})();

// Recursive calls should all be counted.
(function() {
  var o = { f: fun };

  function fun(x) {
    assert.equal(this, o);
    fun.calls += 1;
    if (x > 1) o.f(x - 1);
  }
  fun.calls = 0;

  function hook(target, args) {
    assert.equal(target, o);
    hook.calls += 1;
  }
  hook.calls = 0;

  proxy.before(o, 'f', hook);
  assert.equal(fun.calls, 0);
  assert.equal(hook.calls, 0);

  o.f(42);
  assert.equal(fun.calls, 42);
  assert.equal(hook.calls, 42);
})();

// Like the previous test but now with a monkey-patched method.
(function() {
  var o = { f: fun, g: fun };

  function fun(x) {
    assert.equal(this, o);
    fun.calls += 1;
    if (x > 1) o.f(x - 1);
  }
  fun.calls = 0;

  function hook(target, args) {
    assert.equal(target, o);
    hook.calls += 1;
  }
  hook.calls = 0;

  proxy.before(o, 'f', hook);
  o.f = o.f.bind(o);
  assert.equal(fun.calls, 0);
  assert.equal(hook.calls, 0);

  o.f(42);
  assert.equal(fun.calls, 42);
  assert.equal(hook.calls, 42);

  o.g(42);
  assert.equal(fun.calls, 42 + 42);
  assert.equal(hook.calls, 42 + 42);
})();

// Called patched method with another receiver.
(function() {
  var o = { f: fun };
  var p = {};

  function fun() {
    assert.equal(this, p);
    fun.calls += 1;
  }
  fun.calls = 0;

  function hook(target, args) {
    assert.equal(target, p);
    hook.calls += 1;
  }
  hook.calls = 0;

  proxy.before(o, 'f', hook);
  assert.equal(fun.calls, 0);
  assert.equal(hook.calls, 0);

  o.f.call(p);
  assert.equal(fun.calls, 1);
  assert.equal(hook.calls, 1);
})();

// Prototype chaining.
(function() {
  var o = { f: fun };

  function fun() { fun.calls += 1 }
  fun.calls = 0;

  function hook(target, args) { hook.calls += 1 }
  hook.calls = 0;

  proxy.before(o, 'f', hook);
  assert.equal(fun.calls, 0);
  assert.equal(hook.calls, 0);

  o.f();
  assert.equal(fun.calls, 1);
  assert.equal(hook.calls, 1);

  var p = { __proto__: o };
  p.f();
  assert.equal(fun.calls, 2);
  assert.equal(hook.calls, 2);
})();

// Null prototype.
(function() {
  var o = { __proto__: null, f: fun };

  function fun() { fun.calls += 1 }
  fun.calls = 0;

  function hook(target, args) { hook.calls += 1 }
  hook.calls = 0;

  proxy.before(o, 'f', hook);
  assert.equal(fun.calls, 0);
  assert.equal(hook.calls, 0);

  o.f();
  assert.equal(fun.calls, 1);
  assert.equal(hook.calls, 1);
})();

// Classic getters.
(function() {
  function p1(recv, rval) {
    assert.equal(recv, o);
    assert.equal(rval, 42);
    p1.calls += 1;
  }
  p1.calls = 0;

  function p2(recv, rval) {
    assert.equal(recv, o);
    assert.equal(rval, 42);
    p2.calls += 1;
  }
  p2.calls = 0;

  var o = {
    get x() { this.calls += 1; return 42; },
    calls: 0,
  };
  assert.equal(o.x, 42);
  assert.equal(o.calls, 1);

  proxy.getter(o, 'x', p1);
  assert.equal(o.x, 42);
  assert.equal(o.calls, 2);
  assert.equal(p1.calls, 1);

  var before = Object.getOwnPropertyDescriptor(o, 'x');
  proxy.getter(o, 'x', p2);
  var after = Object.getOwnPropertyDescriptor(o, 'x');
  assert.equal(before.get, after.get);
  assert.equal(o.x, 42);
  assert.equal(o.calls, 3);
  assert.equal(p1.calls, 2);
  assert.equal(p2.calls, 1);
})();

// __defineGetter__, a.k.a. the old new thing.
(function() {
  function p1(recv, rval) {
    assert.equal(recv, o);
    assert.equal(rval, 42);
    p1.calls += 1;
  }
  p1.calls = 0;

  function p2(recv, rval) {
    assert.equal(recv, o);
    assert.equal(rval, 42);
    p2.calls += 1;
  }
  p2.calls = 0;

  var o = { calls: 0 };
  o.__defineGetter__('x', function() { this.calls += 1; return 42; });
  assert.equal(o.x, 42);
  assert.equal(o.calls, 1);

  proxy.getter(o, 'x', p1);
  assert.equal(o.x, 42);
  assert.equal(o.calls, 2);
  assert.equal(p1.calls, 1);

  var before = Object.getOwnPropertyDescriptor(o, 'x');
  proxy.getter(o, 'x', p2);
  var after = Object.getOwnPropertyDescriptor(o, 'x');
  assert.equal(before.get, after.get);
  assert.equal(o.x, 42);
  assert.equal(o.calls, 3);
  assert.equal(p1.calls, 2);
  assert.equal(p2.calls, 1);
})();

// Object.defineProperty() getter.
(function() {
  function p1(recv, rval) {
    assert.equal(recv, o);
    assert.equal(rval, 42);
    p1.calls += 1;
  }
  p1.calls = 0;

  function p2(recv, rval) {
    assert.equal(recv, o);
    assert.equal(rval, 42);
    p2.calls += 1;
  }
  p2.calls = 0;

  var o = { calls: 0 };
  Object.defineProperty(o, 'x', {
    configurable: true,
    enumerable: false,
    get: function() { this.calls += 1; return 42; },
  });
  assert.equal(o.x, 42);
  assert.equal(o.calls, 1);

  proxy.getter(o, 'x', p1);
  assert.equal(o.x, 42);
  assert.equal(o.calls, 2);
  assert.equal(p1.calls, 1);
  assert.equal(Object.getOwnPropertyDescriptor(o, 'x').configurable, true);
  assert.equal(Object.getOwnPropertyDescriptor(o, 'x').enumerable, false);

  var before = Object.getOwnPropertyDescriptor(o, 'x');
  proxy.getter(o, 'x', p2);
  var after = Object.getOwnPropertyDescriptor(o, 'x');
  assert.equal(before.get, after.get);
  assert.equal(o.x, 42);
  assert.equal(o.calls, 3);
  assert.equal(p1.calls, 2);
  assert.equal(p2.calls, 1);
  assert.equal(Object.getOwnPropertyDescriptor(o, 'x').configurable, true);
  assert.equal(Object.getOwnPropertyDescriptor(o, 'x').enumerable, false);
})();

// Two properties, one getter.
(function() {
  function p1(recv, rval) {
    assert.equal(recv, o);
    assert.equal(rval, 42);
    p1.calls += 1;
  }
  p1.calls = 0;

  function p2(recv, rval) {
    assert.equal(recv, o);
    assert.equal(rval, 42);
    p2.calls += 1;
  }
  p2.calls = 0;

  function getter() {
    getter.calls += 1;
    return getter.calls;
  }
  getter.calls = 0;

  var o = {};
  var des = { configurable: true, enumerable: false, get: getter };
  Object.defineProperty(o, 'x', des);
  Object.defineProperty(o, 'y', des);
  assert.equal(o.x, 1);
  assert.equal(getter.calls, 1);

  assert.equal(o.y, 2);
  assert.equal(getter.calls, 2);

  proxy.getter(o, 'x', p1);
  assert.equal(Object.getOwnPropertyDescriptor(o, 'x').get,
               Object.getOwnPropertyDescriptor(o, 'y').get);
  assert.equal(p1.calls, 0);

  proxy.getter(o, 'y', p2);
  assert.equal(Object.getOwnPropertyDescriptor(o, 'x').get,
               Object.getOwnPropertyDescriptor(o, 'y').get);
  assert.equal(p2.calls, 0);
})();
