'use strict';

process.env.SL_ENV = 'dev';

var assert = require('assert');
var async = require('async');
var agent = require('../');
var net = require('net');
var util = require('util');

agent.profile('deadbeef', 'deadbeef', { endpoint: 'http://localhost:1' });

agent.stop();

var keepAlive = net.createServer().listen(0);

function stop() {
  keepAlive.close();
}

var hook;

agent.transport.send = function(cmd) {
  console.log('fake transport sending:',  util.format.apply(null,arguments));

  // redirect profile commands to our hook
  if (cmd.indexOf('profile') >= 0) {
    hook && hook.apply(null, arguments);
  }
};

function expect(event, callback) {
  hook = callback;
  console.log('fake transport recving:', event);
  agent.transport.emit(event);
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
