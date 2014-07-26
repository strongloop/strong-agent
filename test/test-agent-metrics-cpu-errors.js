var metrics = require('strong-agent').metrics;
var tap = require('tap');

var check = metrics._checkCpuProfSupported;

tap.test('with no addon', function(t) {
  try {
    check(null);
    t.fail();
  } catch(er) {
    t.assert(/unavailable without compile/.test(er.message));
    t.end();
  }
});

tap.test('with no profiling', function(t) {
  try {
    check({});
    t.fail();
  } catch(er) {
    t.assert(/unavailable on Node.js v/.test(er.message));
    t.end();
  }
});

tap.test('with support', function(t) {
  t.equal(null, check({
    stopCpuProfilingAndSerialize: true,
    startCpuProfiling: true,
  }));
  t.end();
});

tap.test('only public methods are enumerable', function(t) {
  t.equal(Object.keys(metrics).length, 4);
  for (var p in metrics) {
    t.notEqual(p, '_checkCpuProfSupported');
  }
  t.end();
});
