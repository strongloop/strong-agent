'use strict';

process.env.SL_ENV = 'dev';

var agent = require('../');
var assert = require('assert');
var http = require('http');
var output = [];

var server = http.createServer(function(req, res) {
  res.write('<blink>\n');
}).listen(function() {
  agent.warn = output.push.bind(output);
  agent.profile('some key', 'some app', {
    endpoint: {
      host: this.address().address,
      port: this.address().port,
      secure: false,
    },
  });
  agent.transport.ondecodererror = (function(f) {
    return function(err) {
      var des = Object.getOwnPropertyDescriptor(err, 'data');
      assert.equal(des.enumerable, false);
      f.apply(this, arguments);
      server.close();
      agent.stop();
    };
  })(agent.transport.ondecodererror);
});

process.on('exit', function() {
  assert.equal(output[0], 'transport error: %s (input: \'%s\')');
  assert.equal(output[1], 'Unexpected token <');
  assert.equal(output[2], '<blink>\\n');
});
