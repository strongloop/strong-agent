'use strict';

var proxy = require('../proxy');
var counts = require('../counts');

// Assumes following usage suggested in the README:
// ```
// var pub = require('axon').socket('pub');
// var sub = require('axon').socket('sub');
// ```

// TODO(rmg): Support PubEmitter/SubEmitter, it doesn't use the same
//            send()/on('message') pattern as the others:
//            https://github.com/visionmedia/axon#pubemitter--subemitter

module.exports = function(axon) {

  // TODO(rmg): Instrument axon.Socket.prototype instead?
  proxy.after(axon, 'socket', function(obj, args, socket) {

    proxy.after(socket, 'send', function(obj, args) {
      // When MQ metrics were first added to StrongOps it was for StrongMQ
      // specifically, so the metric names have been immortalized
      counts.sample('strongmq_out');
    });

    proxy.before(socket, ['on', 'addListener'], function(obj, args) {
      var event = args[0];

      // TODO(rmg): PubEmitter/SubEmitter allows user-defined events
      if (event !== 'message') return;

      proxy.callback(args, -1, function(obj, args, extra) {
        // When MQ metrics were first added to StrongOps it was for StrongMQ
        // specifically, so the metric names have been immortalized
        counts.sample('strongmq_in');
      });
    });

  });

};
