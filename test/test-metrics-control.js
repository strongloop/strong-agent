'use strict';

process.env.SL_ENV = 'test';

var agent = require('../');
var assert = require('assert');
var config = require('../lib/config');
var debug = require('../lib/debug')('test');
var endpoint = require('./endpoint');

var ok;
process.on('exit', function() { assert(ok); });

// Do some cheating to speed up the test
config.heapDiffInterval = 500;

endpoint(function() {
  var collector = this;
  var metrics = {};

  // Start profiling
  agent.profile('some key', 'some app', {
    endpoint: {
      host: this.address().address,
      port: this.address().port,
      secure: false,
    },
    quiet: true,
  });

  this.on('handshake', function(connection) {
    debug('handshaked');
    connection.send('memory:start');
  });

  agent.use(function(name, value) {
    debug('metric: %s=%s', name, value);

    metrics[name] = value;

    // loop.count is always reported, object.* counts are only reported
    // after the memory:start command is received via control/transport
    if ('loop.count' in metrics && 'object.Object.count' in metrics) {
      if (!ok) {
        debug('PASS: loop count and object count seen, shutting down.')
        collector.close();
        agent.stop();
        ok = true;
      }
    }
  });

});
