'use strict';

process.env.SL_ENV = 'dev';

var assert = require('assert');
var async = require('async');
var agent = require('../');
var debug = require('../lib/debug')('test');
var net = require('net');
var util = require('util');

agent.profile('deadbeef', 'deadbeef', { endpoint: 'http://localhost:1' });

agent.stop();

var keepAlive = net.createServer().listen(0);

function stop() {
  keepAlive.close();
}

var hook;

agent.transport.send = function(message) {
  debug('fake transport is being sent: %j',  message);

  // redirect profile commands to our hook
  if (message.cmd.indexOf('profile') >= 0) {
    hook && hook.apply(null, [message.cmd].concat(message.args));
  }
};

function expect(event, callback) {
  hook = callback;
  debug('fake transport pretends to receive:', event);
  agent.transport.emit('message', {cmd: event, args:[]});
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
