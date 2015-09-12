'use strict';

var agent = require('../').profile('some app', 'some key');;

var assert = require('assert');
var http = require('http');
var express = require('express');

var path = require('path');
var metricsPath = require.resolve('strong-express-metrics/package.json');
// loopback-boot loads middleware by using a full path to the module
var metrics = require(path.dirname(metricsPath));

var collected = 0;
process.on('exit', function() {
  assert.equal(collected, 1, 'expected: 1 record, actual: ' + collected);
});

agent.on('express:usage-record', function(record) {
  collected++;
  // NOTE(bajtos) Move the assertion to a new tick (stack), because
  // express-metrics catches (and ignores) errors thrown by record observers
  // and the test never fails as a result.
  setImmediate(function() {
    assert.deepEqual(
      Object.keys(record).sort(),
      ['client', 'data', 'process', 'request', 'response', 'timestamp',
        'version',
      ]);
  });
});

var app = express();
app.use(metrics());

var server = app.listen(0, '127.0.0.1', function() {
  http.get(
    {
      host: this.address().address,
      port: this.address().port,
      path: '/',
    },
    function(res) {
      res.resume();
      res.on('end', function() {
        server.close();
      });
    }
  );
});
