'use strict';

process.env.SL_ENV = 'dev';
var config = require('../lib/config');
config.collectInterval = 25;
config.metricsInterval = 25;
config.tiersInterval = 25;
config.loopInterval = 25;

var agent = require('..');
var assert = require('assert');
var http = require('http');
var json = require('../lib/json');

// Keep node alive until test is done (since agent unrefs all its handles)
process.stdin.resume();

agent.profile('some key', 'some app', {
  endpoint: {
    host: '127.0.0.1',
    port: 1,
    secure: false,
  },
});

agent.transport.request.once('error', function(err) {
  process.nextTick(function() {
    assert.equal(agent.transport.state, 'not-connected');
    setTimeout(function() {
      setTimeout(function() {
        process.stdin.pause(); // Allow node to exit
      }, 250);
    });
  });
});

process.on('exit', function() {
  console.log('queue length:', agent.transport.sendQueue.length);
  assert(agent.transport.sendQueue.length > 0);
});
