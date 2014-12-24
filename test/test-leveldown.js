'use strict';

var assert = require('assert');
var graphHelper = require('../lib/graph-helper');
var agent = require('../');
var proxy = require('../lib/proxy');
var topFunctions = require('../lib/top-functions');

proxy.init(agent);

var leveldownWrapper = require('../lib/wrapping-probes/leveldown');

var mockIterator = {
  next: function(cb) { setImmediate(cb); },
  end: function(cb) { setImmediate(cb); }
};

var mockDB = {
  put: function(k, v, cb) { setImmediate(cb); },
  get: function(k, cb) { setImmediate(cb); },
  del: function(k, cb) { setImmediate(cb); },
  batch: function(ops, cb) { setImmediate(cb); },
  iterator: function() { return mockIterator; }
};

function mockLeveldown(location) { return mockDB; }

mockLeveldown.destroy = function() {};
mockLeveldown.repair = function() {};

var wrapped = leveldownWrapper(mockLeveldown);
assert(wrapped.arity == mockLeveldown.arity);

var wrapped = leveldownWrapper(mockLeveldown);
assert(wrapped.destroy === mockLeveldown.destroy);
assert(wrapped.repair === mockLeveldown.repair);

var wrapped = leveldownWrapper(mockLeveldown);
var db = wrapped('db.location');
assert(db.get);
assert(db.put);
assert(db.del);

var leveldown = leveldownWrapper(mockLeveldown);
var db = leveldown('db.dir');
var iter = db.iterator();

var tests = [
  function records_topfunction_entry_for_put(done) {
    // TODO: query should be db.dir.put.key
    db.put('key', 'val', function() {
      assert.equal(topFunctions.add.numcalls, 1);
      done();
    });
  },

  function records_topfunction_entry_for_get(done) {
    // TODO: query should be db.dir.get.key
    db.get('key', function() {
      assert.equal(topFunctions.add.numcalls, 1);
      done();
    });
  },

  function records_topfunction_entry_for_del(done) {
    // TODO: query should be db.dir.del.key
    db.del('key', function() {
      assert.equal(topFunctions.add.numcalls, 1);
      done();
    });
  },

  function records_topfunction_entry_for_batch(done) {
    // TODO: query should be db.dir.batch.<actions list length>
    db.batch([], function() {
      assert.equal(topFunctions.add.numcalls, 1);
      done();
    });
  },

  function graphs_put_times(done) {
    db.put('key', 'val', function() {
      assert.equal(graphHelper.updateTimes.numcalls, 1);
      done();
    });
  },

  function graphs_get_times(done) {
    db.get('key', function() {
      assert.equal(graphHelper.updateTimes.numcalls, 1);
      done();
    });
  },

  function graphs_del_times(done) {
    db.del('key', function() {
      assert.equal(graphHelper.updateTimes.numcalls, 1);
      done();
    });
  },

  function graphs_batch_times(done) {
    db.batch([], function() {
      assert.equal(graphHelper.updateTimes.numcalls, 1);
      done();
    });
  },

  function adds_topsfunction_every_for_next(done) {
    iter.next(function() {
      assert.equal(topFunctions.add.numcalls, 1);
      done();
    });
  },

  function adds_topsfunction_every_for_end(done) {
    iter.end(function() {
      assert.equal(topFunctions.add.numcalls, 1);
      done();
    });
  },

  function adds_graphhelper_time_for_next(done) {
    iter.next(function() {
      assert.equal(graphHelper.updateTimes.numcalls, 1);
      done();
    });
  },

  function adds_graphhelper_time_for_end(done) {
    iter.end(function() {
      assert.equal(graphHelper.updateTimes.numcalls, 1);
      done();
    });
  },
];

function wrap(f) {
  var g = function() {
    g.numcalls += 1;
    return f.apply(this, arguments);
  };
  g.numcalls = 0;
  return g;
}

graphHelper.updateTimes = wrap(graphHelper.updateTimes);
topFunctions.add = wrap(topFunctions.add);

tests.slice().reverse().reduce(function(next, test) {
  return function() {
    test(function() {
      graphHelper.updateTimes.numcalls = 0;
      topFunctions.add.numcalls = 0;
      if (next) next();
    });
  };
}, null)();  // <- Monad!
