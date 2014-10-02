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

tap.test('fail to find non-existent script', function(t) {
  t.equal(undefined, di.findScript('/no/such/file/.js/exists'));
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

tap.test('apply erroring patches', {skip: false}, function(t) {
  di.patch({
    'dyninst-target': [
      {type: 'timer-start', line: 2, metric: 'xxx', 'context': 'nosuch'},
      {type: 'timer-stop', line: 6, metric: 'yyy', 'context': 'nosuch'},
    ]
  });
  t.doesNotThrow(target.hello.bind(target));
  t.doesNotThrow(target.bye.bind(target));
  t.end();
});

tap.test('apply patches', {skip: false}, function(t) {
  var er = di.patch({
    '/no/such/.js/file/exists': [
      {type: 'code', line: 2, code: 'return "xxx";'},
    ]
  });
  t.equal(er.error, 'noscript');
  t.end();
});
