var tap = require('tap');
var target = require('./dyninst-target');
var di = require('../lib/dyninst-metrics');

di.init(null, require('../lib/dyninst'));

tap.test('find target script', function(t) {
  var fullname = require.resolve('./dyninst-target');
  t.equal(di.findScript('dyninst-target').name, fullname);
  t.end();
});

tap.test('find http script', function(t) {
  require('http');
  t.equal(di.findScript('http.js').name, 'http.js');
  t.end();
});

tap.test('find exactly http script', function(t) {
  require('http');
  t.equal(di.findScript('^http.js$').name, 'http.js');
  t.end();
});

tap.test('patch a line', function(t) {
  t.equal('hello', target.hello());
  di.patchLine('dyninst-target', 2, 'return "patched!";');
  t.equal(target.hello(), 'patched!');
  t.end();
});

tap.test('apply patches', {skip: false}, function(t) {
  t.equal('bye', target.bye());
  di.patch({
    'dyninst-target': [
      {type: 'code', line: 2, code: 'return "xxx";'},
      {type: 'code', line: 6, code: 'return "yyy";'},
    ]
  });
  t.equal('xxx', target.hello());
  t.equal('yyy', target.bye());
  t.end();
});
