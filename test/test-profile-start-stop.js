'use strict';

require('../lib/config').baseInterval = 25;

var assert = require('assert');
var async = require('async');
var agent = require('../');
var net = require('net');
var util = require('util');

agent.profile('deadbeef', 'deadbeef');

agent.stop();

var keepAlive = net.createServer().listen(0);

function stop() { keepAlive.close(); }

var hook;

agent.internal.emit = (function(f) {
  return function(event) {
    // redirect profile commands to our hook
    if (event.indexOf('profile') >= 0) {
      hook && hook.apply(null, [].slice.apply(arguments));
    }
    return f.apply(this, arguments);
  };
})(agent.internal.emit);

function expect(event, callback) {
  hook = callback;
  agent.internal.emit(event);
}

var tests = [
  function(done) {
    console.log('test memory start/stop');
    return done();
  },
  function(done) {
    expect('memory:start', function(cmd, type) {
      assert.equal(cmd, 'profile:start');
      assert.equal(type, 'memory');
      return done();
    });
  },
  function(done) {
    expect('memory:start', function(cmd, type) {
      assert.equal(cmd, 'profile:start');
      assert.equal(type, 'memory');
      return done();
    });
  },
  function(done) {
    expect('memory:stop', function(cmd, type) {
      assert.equal(cmd, 'profile:stop:v2');
      assert.equal(type, 'memory');
      return done();
    });
  },
  function(done) {
    expect('memory:stop', function(cmd, type) {
      assert.equal(cmd, 'profile:stop:v2');
      assert.equal(type, 'memory');
      return done();
    });
  },
  function(done) {
    console.log('deleting memory addon, and retrying tests');
    require('../lib/profilers/memory').addon = null;
    return done();
  },
  function(done) {
    expect('memory:start', function(cmd, type) {
      assert.equal(cmd, 'profile:unsupported');
      assert.equal(type, 'memory');
      return done();
    });
  },
  function(done) {
    expect('memory:stop', function(cmd, type) {
      assert.equal(cmd, 'profile:stop:v2');
      assert.equal(type, 'memory');
      return done();
    });
  },
  function(done) {
    console.log('test cpu start/stop');
    return done();
  },
  function(done) {
    expect('cpu:start', function(cmd, type) {
      assert.equal(cmd, 'profile:start');
      assert.equal(type, 'cpu');
      return done();
    });
  },
  function(done) {
    expect('cpu:start', function(cmd, type) {
      assert.equal(cmd, 'profile:start');
      assert.equal(type, 'cpu');
      return done();
    });
  },
  function(done) {
    expect('cpu:stop', function(cmd, rowid, data) {
      assert.equal(cmd, 'profile:stop:v2');
      assert(data);
      return done();
    });
  },
  function(done) {
    expect('cpu:stop', function(cmd, rowid, data) {
      assert.equal(cmd, 'profile:stop:v2');
      assert.deepEqual(data, {});
      return done();
    });
  },
  function(done) {
    console.log('deleting cpu addon, and retrying tests');
    require('../lib/profilers/cpu').addon = null;
    return done();
  },
  function(done) {
    expect('cpu:start', function(cmd, type) {
      assert.equal(cmd, 'profile:unsupported');
      assert.equal(type, 'cpu');
      return done();
    });
  },
  function(done) {
    expect('cpu:stop', function(cmd, rowid, data) {
      assert.equal(cmd, 'profile:stop:v2');
      assert.deepEqual(data, {});
      return done();
    });
  },
];

var stopped = false;
process.on('exit', function() { assert(stopped); });

async.series(tests, function(err) {
  assert.ifError(err);
  stop();
  stopped = true;
});
