// Copyright (c) 2014, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

// Note: this file is non-strict because some of the tests test expressions
// that are not allowed in ES5 strict mode, like the 'with' keyword.

var addon = require('../lib/addon');
var agent = require('../');
var assert = require('assert');
var dyninst = require('../lib/dyninst');
var stream = require('stream');

assert(addon, 'add-on not loaded');
var Debug = addon.runInDebugContext('Debug');

// Non-strict tests.
(function() {
  function T(original, expected, config) {
    config = config || {prolog: ';4', epilog: '2;'};
    var f = eval(original);
    var script = Debug.findScript(f);
    assert.equal(typeof(f), 'function');
    dyninst.patch(f, config);
    assert.equal(script.source, expected);
    dyninst.unpatch(f, config);
    assert.equal(script.source, original);
  }
  T('with ({ f: function g() {} }) (function() { return f })()',
    'with ({ f: function g() {;42;} }) (function() { return f })()');
})();

// Check that function expressions are parsed correctly.
(function() {
  'use strict';
  function T(original, expected, config) {
    config = config || {prolog: ';4', epilog: '2;'};
    var f = eval(original);
    var script = Debug.findScript(f);
    assert.equal(typeof(f), 'function');
    dyninst.patch(f, config);
    assert.equal(script.source, expected);
    dyninst.unpatch(f, config);
    assert.equal(script.source, original);
  }
  T('(function() {})', '(function() {;42;})');
  T('function f() {} f', 'function f() {;42;} f');
  T('\uFEFFfunction\t\f\r\n \u00A0f\t\f\r\n \u00A0() {} f',
    '\uFEFFfunction\t\f\r\n \u00A0f\t\f\r\n \u00A0() {;42;} f');
  T('({ f: function() {} }).f', '({ f: function() {;42;} }).f');
  T('(function(f) { return f })(function() {})',
    '(function(f) { return f })(function() {;42;})');
  T('(function() { return this() }).call(function() {' +
        '  return function() {} })',
    '(function() { return this() }).call(function() {' +
        '  return function() {;42;} })');
  T('(function() { return [function f() {}] })()[0]',
    '(function() { return [function f() {;42;}] })()[0]');
  T('do { (function() {}) } while (0)', 'do { (function() {;42;}) } while (0)');
  T('for (;;) { (function() {}); break }',
    'for (;;) { (function() {;42;}); break }');
  T('for (var f = function() {};;) { f; break; }',
    'for (var f = function() {;42;};;) { f; break; }');
  T('for (var f = null; f = function() {}; 0) if (f) { f; break; }',
    'for (var f = null; f = function() {;42;}; 0) if (f) { f; break; }');
  T('for (var f = null;; f = function() {}) if (f) { f; break; }',
    'for (var f = null;; f = function() {;42;}) if (f) { f; break; }');
  T('for (var f = null; f = function() {}; f = function() {})' +
        '  if (f) { f; break; }',
    'for (var f = null; f = function() {;42;}; f = function() {})' +
        '  if (f) { f; break; }');
  T('for (var f = function() {}; f = function() {}; 0)' +
        '  if (f) { f; break; }',
    'for (var f = function() {}; f = function() {;42;}; 0)' +
        '  if (f) { f; break; }');
})();

// Check that empty prologs and epilogs work.
(function() {
  'use strict';
  var f = eval('(function() {})');
  assert.equal(f(), undefined);
  var changes = {prolog: 'return 42'};
  dyninst.patch(f, changes);
  assert.equal(f(), 42);
  dyninst.unpatch(f, changes);
  assert.equal(Debug.source(f), '() {}');
  var f = eval('(function() {})');
  assert.equal(f(), undefined);
  var changes = {epilog: 'return 42'};
  dyninst.patch(f, changes);
  assert.equal(f(), 42);
  dyninst.unpatch(f, changes);
  assert.equal(Debug.source(f), '() {}');
  var f = eval('(function() {})');
  assert.equal(f(), undefined);
  dyninst.patch(f);
  assert.equal(f(), undefined);
  dyninst.unpatch(f);
  assert.equal(Debug.source(f), '() {}');
})();

// Check that inserting code with curly braces works.  V8's built-in diff
// algorithm uses a tokenizing parser that eats curly braces.
(function() {
  'use strict';
  var f = eval('(function() { return 42 })');
  assert.equal(f(), 42);
  var changes = {prolog: ' try {', epilog: '} finally { return 1337 } '};
  dyninst.patch(f, changes);
  assert.equal(Debug.findScript(f).source,
               '(function() { try { return 42 } finally { return 1337 } })');
  assert.equal(f(), 1337);
  dyninst.unpatch(f, changes);
  assert.equal(Debug.findScript(f).source, '(function() { return 42 })');
})();

// Check that identity equality is maintained after patching.
(function() {
  'use strict';
  function f() { return 1337; }
  var g = f;
  assert.equal(f, g);  // Obviously.
  assert.equal(f(), 1337);
  assert.equal(g(), 1337);
  var changes = {prolog: ' return 42;'};
  dyninst.patch(f, changes);
  assert.equal(Debug.source(f), '() { return 42; return 1337; }');
  assert.equal(f, g);  // Not so obviously.
  assert.equal(f(), 42);
  assert.equal(g(), 42);
  dyninst.unpatch(f, changes);
  assert.equal(Debug.source(f), '() { return 1337; }');
  assert.equal(f, g);
  assert.equal(f(), 1337);
  assert.equal(g(), 1337);
})();

// Check that lexical closures work as expected.
(function() {
  'use strict';
  var source = '(function() {' +
               '  var x = 42;' +
               '  var y = 1337;' +
               '  return function() { return x };' +
               '})';
  var f = eval(source);
  var g = f();
  assert.equal(g(), 42);
  var changes = {prolog: 'return y;'};
  dyninst.patch(g, changes);
  assert.equal(g(), 42);  // Old closure still returns the old value.
  var g = f();
  assert.equal(g(), 1337);  // New closure returns the new value.
  // some versions of v8 exhibit a bug that causes g to turn into some
  // sort of `[native code]`, which can't be patched/unpatched
  var unsupportedV8 = [
    '3.26.33', // joyent/node#v0.11.14
    '3.28.73', // joyent/node#v0.12@2014-12-31
    '3.30.37', // iojs/io.js#v0.12@2014-12-13
    '3.31.74.1', // iojs-v1.0.1, iojs-v1.0.2
    '4.1.0.7', // iojs-v1.0.3
  ];
  if (unsupportedV8.indexOf(process.versions.v8) !== -1) {
    return;
  }
  dyninst.unpatch(g, changes);
  // Existing closure keeps pointing to patched code, even after unpatching.
  assert.notEqual(Debug.findScript(g).source, source);
  // But new closure points to the unpatched source again.
  var g = f();
  assert.equal(g(), 42);
  assert.equal(Debug.findScript(g).source, source);

  var source = '(function() {' +
               '  var x = 42;' +
               '  var y = 1337;' +
               '  return function() { return y, x };' +
               '})';
  var f = eval(source);
  var g = f();
  assert.equal(g(), 42);
  var changes = {prolog: 'return y;'};
  dyninst.patch(g, changes);
  assert.equal(g(), 1337);  // Effective immediately because |y| is in scope.
  dyninst.unpatch(g, changes);
  assert.equal(Debug.findScript(g).source, source);  // Ditto.

  var source = '(function() {' +
               '  var a = [42, 1337];' +
               '  return function() { return a[0] };' +
               '})';
  var f = eval(source);
  var g = f();
  assert.equal(g(), 42);
  var changes = {prolog: 'return a[1];'};
  dyninst.patch(g, changes);
  assert.equal(g(), 1337);  // Effective immediately because |a| is in scope.
  dyninst.unpatch(g, changes);
  assert.equal(Debug.findScript(g).source, source);  // Ditto.
})();

(function() {
  'use strict';
  var f = eval('(function() { return [function f() {}] })()')[0];
  dyninst.patch(f, {prolog: 'return 42'});
  assert.equal(Debug.source(f), '() {return 42}');
  dyninst.unpatch(f, {prolog: 'return 42'});
  assert.equal(Debug.source(f), '() {}');
})();

(function() {
  'use strict';
  var f = eval('(function() { return [function f() { ; 0 ; }] })()')[0];
  assert.equal(Debug.source(f), '() { ; 0 ; }');
  dyninst.patch(f, {prolog: ' -1', epilog: '+1 '});
  assert.equal(Debug.source(f), '() { -1 ; 0 ; +1 }');
  dyninst.unpatch(f, {prolog: ' -1', epilog: '+1 '});
  assert.equal(Debug.source(f), '() { ; 0 ; }');
})();

(function() {
  'use strict';
  var a = eval('(function() {' +
               '  function f() {}' +
               '  function g() {}' +
               '  return [f, g];' +
               '})()');
  var f = a[0];
  var g = a[1];
  dyninst.patch(f, {prolog: 'return 42'});
  dyninst.patch(g, {prolog: 'return 42'});
  assert.equal(Debug.source(f), '() {return 42}');
  assert.equal(Debug.source(g), '() {return 42}');
  dyninst.unpatch(f, {prolog: 'return 42'});
  assert.equal(Debug.source(f), '() {}');
  assert.equal(Debug.source(g), '() {return 42}');
  dyninst.unpatch(g, {prolog: 'return 42'});
  assert.equal(Debug.source(f), '() {}');
  assert.equal(Debug.source(g), '() {}');
  dyninst.patch(f, {prolog: 'return 42'});
  dyninst.patch(g, {prolog: 'return 42'});
  assert.equal(Debug.source(f), '() {return 42}');
  assert.equal(Debug.source(g), '() {return 42}');
  dyninst.unpatch(g, {prolog: 'return 42'});
  assert.equal(Debug.source(f), '() {return 42}');
  assert.equal(Debug.source(g), '() {}');
  dyninst.unpatch(f, {prolog: 'return 42'});
  assert.equal(Debug.source(f), '() {}');
  assert.equal(Debug.source(g), '() {}');
})();

(function() {
  'use strict';
  function fun() {
    function f(){f.calls += 1};
    f.calls = 0;
    return f;
  }
  var f = eval('(function(a, b, c) { a(), c(); })');
  var a = fun(), b = fun(), c = fun();
  f(a, b, c);
  assert.equal(a.calls, 1);
  assert.equal(b.calls, 0);
  assert.equal(c.calls, 1);
  var script = Debug.findScript(f);
  var changes = ['(function(a, b, c) { a(), '.length, 'b(), '];
  dyninst.patch(script, changes);
  var a = fun(), b = fun(), c = fun();
  f(a, b, c);
  assert.equal(a.calls, 1);
  assert.equal(b.calls, 1);
  assert.equal(c.calls, 1);
  dyninst.unpatch(script, changes);
  var a = fun(), b = fun(), c = fun();
  f(a, b, c);
  assert.equal(a.calls, 1);
  assert.equal(b.calls, 0);
  assert.equal(c.calls, 1);
})();

(function() {
  'use strict';
  function fun() {
    function f(){f.calls += 1};
    f.calls = 0;
    return f;
  }
  var f = eval('(function f(a, b, c) { b(); })');
  assert.equal(Debug.source(f), '(a, b, c) { b(); }');
  var a = fun(), b = fun(), c = fun();
  f(a, b, c);
  assert.equal(a.calls, 0);
  assert.equal(b.calls, 1);
  assert.equal(c.calls, 0);
  var script = Debug.findScript(f);
  var changes = [
    '(function f(a, b, c) {'.length,
    ' a();',
    '(function f(a, b, c) { b();'.length,
    ' c();'
  ];
  dyninst.patch(script, changes);
  assert.equal(Debug.source(f), '(a, b, c) { a(); b(); c(); }');
  var script = Debug.findScript(f);
  var a = fun(), b = fun(), c = fun();
  f(a, b, c);
  assert.equal(a.calls, 1);
  assert.equal(b.calls, 1);
  assert.equal(c.calls, 1);
  dyninst.unpatch(script, changes);
  assert.equal(Debug.source(f), '(a, b, c) { b(); }');
  var a = fun(), b = fun(), c = fun();
  f(a, b, c);
  assert.equal(a.calls, 0);
  assert.equal(b.calls, 1);
  assert.equal(c.calls, 0);
})();

(function() {
  'use strict';
  function fun() {
    function f(){f.calls += 1};
    f.calls = 0;
    return f;
  }
  var f = eval('(function(a, b, c, d) { c(); })');
  assert.equal(Debug.source(f), '(a, b, c, d) { c(); }');
  var a = fun(), b = fun(), c = fun(), d = fun();
  f(a, b, c, d);
  assert.equal(a.calls, 0);
  assert.equal(b.calls, 0);
  assert.equal(c.calls, 1);
  assert.equal(d.calls, 0);
  var script = Debug.findScript(f);
  var changes = [
    '(function(a, b, c, d) {'.length,
    ' a();',
    '(function(a, b, c, d) {'.length,
    ' b();',
    '(function(a, b, c, d) { c();'.length,
    ' d();'
  ];
  dyninst.patch(script, changes);
  assert.equal(Debug.source(f), '(a, b, c, d) { a(); b(); c(); d(); }');
  var a = fun(), b = fun(), c = fun(), d = fun();
  f(a, b, c, d);
  assert.equal(a.calls, 1);
  assert.equal(b.calls, 1);
  assert.equal(c.calls, 1);
  assert.equal(d.calls, 1);
  dyninst.unpatch(script, changes);
  assert.equal(Debug.source(f), '(a, b, c, d) { c(); }');
  var a = fun(), b = fun(), c = fun(), d = fun();
  f(a, b, c, d);
  assert.equal(a.calls, 0);
  assert.equal(b.calls, 0);
  assert.equal(c.calls, 1);
  assert.equal(d.calls, 0);
})();

(function() {
  'use strict';
  var n = Debug.scripts().length;
  eval('');
  // Caveat emptor: there is nothing that holds a reference to the script so
  // it's eligible for garbage collection.  That means this test is somewhat
  // race-y but I don't think that can be helped.
  var script =
      Debug.scripts().sort(function(a, b) { return a.id - b.id }).slice(n)[0];
  assert.equal(script.source, '');
  assert.equal(dyninst.position(script, 0, 0), 0);
  assert.equal(dyninst.position(script, 1, 0), -1);
  assert.equal(dyninst.position(script, 0, 1), -1);
  assert.equal(dyninst.position(script, 1, 1), -1);
  assert.throws(function() { dyninst.position(script, -1, 0) });
  assert.throws(function() { dyninst.position(script, 0, -1) });
  assert.throws(function() { dyninst.position(script, -1, -1) });
})();

(function() {
  'use strict';
  var f = eval('(function() {\n0,1,2,3;\n4,5,6,7;\n})');
  var script = Debug.findScript(f);
  assert.equal(dyninst.position(script, 0, 0), 0);
  assert.equal(dyninst.position(script, 0, '(function() {'.length),
               '(function() {'.length);
  assert.equal(dyninst.position(script, 0, '(function() {\n'.length),
               '(function() {\n'.length);
  assert.equal(dyninst.position(script, 1, 0), '(function() {\n'.length);
  assert.equal(dyninst.position(script, 2, 0),
               '(function() {\n0,1,2,3;\n'.length);
  assert.equal(dyninst.position(script, 3, 0),
               '(function() {\n0,1,2,3;\n4,5,6,7;\n'.length);
  assert.equal(dyninst.position(script, 4, 0), -1);
})();

[
  function(next) {
    'use strict';
    var driver = dyninst.driver();
    var cmd = {cmd: 'scripts', version: 0};
    driver.submit(cmd, function(err, before) {
      assert.equal(err, null);
      checkisflat(before);
      var f = eval('(function f(x) { return x })');
      driver.submit(cmd, function(err, after) {
        assert.equal(err, null);
        checkisflat(after);
        var id = Debug.findScript(f).id;
        assert.equal(before.filter(even).indexOf(id), -1);
        assert.notEqual(after.filter(even).indexOf(id), -1);
        function even(_, i) { return i % 2 == 0 }
        var scripts = Debug.scripts();  // Keep reference to script objects.
        var scriptids = scripts.map(function(script) { return script.id });
        var cmd = {cmd: 'sources', scriptids: scriptids, version: 0};
        driver.submit(cmd, function(err, result) {
          assert.equal(err, null);
          assert.equal(Array.isArray(result), true);
          assert.equal(result.length, 2 * scripts.length);
          for (var i = 0, k = 0, n = scripts.length; i < n; i += 1, k += 2) {
            assert.equal(result[k + 0], scripts[i].source);
            assert.deepEqual(result[k + 1], scripts[i].line_ends);
          }
          next();
        });
      });
    });
    function checkisflat(lst) {
      assert.equal(Array.isArray(lst), true);
      assert.equal(lst.length % 2, 0);
      for (var i = 0, n = lst.length; i < n; i += 2) {
        assert.equal(typeof(lst[i + 0]), 'number');
        assert.equal(typeof(lst[i + 1]), 'string');
      }
    }
  },

  function(next) {
    'use strict';
    var f = eval('(function f(x) { return x })');
    var scriptid = Debug.findScript(f).id;
    var driver = dyninst.driver();
    var changes = ['(function f(x) { return'.length, ' x * '];
    var cmd = {changes: changes, cmd: 'patch', scriptid: scriptid, version: 0};
    assert.equal(f(42), 42);
    driver.submit(cmd, function(err, result) {
      assert.equal(err, null);
      assert.equal(f(42), 42 * 42);
      var cmd = {cmd: 'unpatch', patchid: result.patchid, version: 0};
      driver.submit(cmd, function(err, result) {
        assert.equal(err, null);
        assert.equal(f(42), 42);
        next();
      });
    });
  },

  function(next) {
    'use strict';
    var f = eval('(function f(x) { return x })');
    var scriptid = Debug.findScript(f).id;
    var driver = dyninst.driver();
    var changes = [42, '<fail>'];
    var cmd = {changes: changes, cmd: 'patch', scriptid: scriptid, version: 0};
    driver.submit(cmd, function(err, result) {
      assert(err instanceof Error);
      next();
    });
  },

  function(next) {
    'use strict';
    var f = eval('(function f(x) { return x })');
    var g = eval('(function g(x) { return x })');
    var scriptid = Debug.findScript(f).id;
    var driver = dyninst.driver();
    var changes = ['(function f(x) { return'.length, ' 2 * '];
    var cmd = {changes: changes, cmd: 'patch', scriptid: scriptid, version: 0};
    assert.equal(f(42), 42);
    driver.submit(cmd, p0);

    function p0(err, result) {
      assert.equal(err, null);
      assert.equal(f(42), 2 * 42);
      assert.equal(result.patchid > 0, true);
      p0.patchid = result.patchid;
      var changes = ['(function f(x) { return'.length, ' 3 * '];
      var cmd =
          {changes: changes, cmd: 'patch', scriptid: scriptid, version: 0};
      driver.submit(cmd, p1);
    }

    function p1(err, result) {
      assert.equal(err, null);
      assert.equal(f(42), 2 * 3 * 42);
      assert.equal(result.patchid > 0, true);
      p1.patchid = result.patchid;
      // Now patch a function in another script for good measure.
      var changes = ['(function g(x) { return'.length, ' -1 * '];
      var cmd = {
        changes: changes,
        cmd: 'patch',
        scriptid: Debug.findScript(g).id,
        version: 0
      };
      assert.equal(g(42), 42);
      driver.submit(cmd, p2);
    }

    function p2(err, result) {
      assert.equal(err, null);
      assert.equal(f(42), 2 * 3 * 42);
      assert.equal(result.patchid > 0, true);
      p2.patchid = result.patchid;
      var changes = ['(function f(x) { return'.length, ' 5 * '];
      var cmd =
          {changes: changes, cmd: 'patch', scriptid: scriptid, version: 0};
      driver.submit(cmd, p3);
    }

    function p3(err, result) {
      assert.equal(err, null);
      assert.equal(f(42), 2 * 3 * 5 * 42);
      assert.equal(result.patchid > 0, true);
      p3.patchid = result.patchid;
      var cmd = {cmd: 'unpatch', patchid: p0.patchid, version: 0};
      driver.submit(cmd, p4);
    }

    function p4(err, result) {
      assert.equal(err, null);
      assert.equal(f(42), 3 * 5 * 42);
      var cmd = {cmd: 'unpatch', patchid: p1.patchid, version: 0};
      driver.submit(cmd, p5);
    }

    function p5(err, result) {
      assert.equal(err, null);
      assert.equal(f(42), 5 * 42);
      assert.equal(g(42), -42);
      var cmd = {cmd: 'unpatch', patchid: p2.patchid, version: 0};
      driver.submit(cmd, p6);
    }

    function p6(err, result) {
      assert.equal(err, null);
      assert.equal(f(42), 5 * 42);
      assert.equal(g(42), 42);
      var cmd = {cmd: 'unpatch', patchid: p3.patchid, version: 0};
      driver.submit(cmd, p7);
    }

    function p7(err, result) {
      assert.equal(err, null);
      assert.equal(f(42), 42);
      next();
    }
  },

  function(next) {
    'use strict';
    var f = eval('(function f(x) { return x })');
    var cmd = {
      cmd: 'patch',
      changes: ['(function f(x) { return'.length, ' x *'],
      scriptid: Debug.findScript(f).id,
      version: 0,
    };
    var pass = stream.PassThrough();
    pass.pipe(process.stdout);
    agent.dyninst(pass);
    // Skip the first data packet, that's the one we just sent.
    second(pass, 'data', function(data) {
      var result = JSON.parse('' + data);
      assert.equal(result.patchid > 0, true);
      assert.equal(f(42), 1764);
      var cmd = {cmd: 'unpatch', patchid: result.patchid, version: 0};
      pass.write(JSON.stringify(cmd) + '\n');
      second(pass, 'data', function(data) {
        assert.equal(f(42), 42);
        next();
      });
    });
    function second(obj, evt, fun) {
      obj.once(evt, function() {
        obj.once(evt, function() { fun.apply(this, arguments); });
      });
    }
  }
]
    .slice()
    .reverse()
    .reduce(function(next, test) { return test.bind(null, next); }, null)();
