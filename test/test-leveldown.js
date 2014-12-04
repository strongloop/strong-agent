'use strict';

var assert = require('assert');
var counts = require('../lib/counts');
var config = require('../lib/config');
var graphHelper = require('../lib/graph-helper');
var agent = require('../');
var proxy = require('../lib/proxy');
var sinon = require('sinon');
var tiers = require('../lib/tiers');
var topFunctions = require('../lib/top-functions');

// Ouch.
proxy.init(agent);
counts.init(agent, config.baseInterval);
tiers.init(agent, config.baseInterval);
topFunctions.init(agent, config.baseInterval);

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
      assert(topFunctions.add.calledOnce);
      done();
    });
  },

  function records_topfunction_entry_for_get(done) {
    // TODO: query should be db.dir.get.key
    db.get('key', function() {
      assert(topFunctions.add.calledOnce);
      done();
    });
  },

  function records_topfunction_entry_for_del(done) {
    // TODO: query should be db.dir.del.key
    db.del('key', function() {
      assert(topFunctions.add.calledOnce);
      done();
    });
  },

  function records_topfunction_entry_for_batch(done) {
    // TODO: query should be db.dir.batch.<actions list length>
    db.batch([], function() {
      assert(topFunctions.add.calledOnce);
      done();
    });
  },

  function graphs_put_times(done) {
    db.put('key', 'val', function() {
      assert(graphHelper.updateTimes.calledOnce);
      done();
    });
  },

  function graphs_get_times(done) {
    db.get('key', function() {
      assert(graphHelper.updateTimes.calledOnce);
      done();
    });
  },

  function graphs_del_times(done) {
    db.del('key', function() {
      assert(graphHelper.updateTimes.calledOnce);
      done();
    });
  },

  function graphs_batch_times(done) {
    db.batch([], function() {
      assert(graphHelper.updateTimes.calledOnce);
      done();
    });
  },

  function adds_topsfunction_every_for_next(done) {
    iter.next(function() {
      assert(topFunctions.add.calledOnce);
      done();
    });
  },

  function adds_topsfunction_every_for_end(done) {
    iter.end(function() {
      assert(topFunctions.add.calledOnce);
      done();
    });
  },

  function adds_graphhelper_time_for_next(done) {
    iter.next(function() {
      assert(graphHelper.updateTimes.calledOnce);
      done();
    });
  },

  function adds_graphhelper_time_for_end(done) {
    iter.end(function() {
      assert(graphHelper.updateTimes.calledOnce);
      done();
    });
  },
];

tests.slice().reverse().reduce(function(next, test) {
  return function() {
    sinon.spy(topFunctions, 'add');
    sinon.spy(graphHelper, 'updateTimes');
    test(function() {
      topFunctions.add.restore();
      graphHelper.updateTimes.restore();
      if (next) next();
    });
  };
}, null)();  // <- Monad!
