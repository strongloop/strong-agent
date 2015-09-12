'use strict';

var fmt = require('util').format;
if (process.env.MONGODB_HOST && process.env.MONGODB_PORT) {
  process.env.MONGODB_PARAM = fmt('mongodb://%s:%d/myproject',
                                  process.env.MONGODB_HOST,
                                  process.env.MONGODB_PORT);
}

var maybeSkip = process.env.MONGODB_PARAM
              ? false
              : {skip: 'Incomplete MongoDB environment.'};

process.env.STRONGLOOP_LICENSE = require('./helpers').shortTestLicense();

var agent = require('../');
var assert = require('assert');
var tap = require('tap');

var metrics = [];
agent.use(metrics.push.bind(metrics));

agent.error = assert.fail;

var CORRECT_RESULT = '42';
var INSERT_DATA = [
  {a : CORRECT_RESULT + '.0'},
  {b : CORRECT_RESULT + '.1'},
  {c : CORRECT_RESULT + '.2'}
  ];

tap.test('MongoDB probe', maybeSkip, function(t) {
  require('mongodb').MongoClient.connect(process.env.MONGODB_PARAM,
    function(err, client) {
      var connected = (err == null && client != null &&
          client.collection != null);
      t.ok(connected, 'MongoDB connected.');
      if (!connected) {
        t.end();
        return;
      }
      var collection = client.collection('documents');
      collection.insert(
          INSERT_DATA,
          function(err, result) {
            var querySuccess = (err == null && result != null);
            t.ok(querySuccess, 'MongoDB query result returned.');
            if (!querySuccess) {
              client.close();
              t.end();
              return;
            }
            t.comment('result: ' + JSON.stringify(result));
            // verify the recorded MongoDB metrics
            agent.poll();
            t.comment('metrics: ' + JSON.stringify(metrics));
            var ixAvg = metrics.indexOf('tiers.mongodb.average');
            var ixMin = metrics.indexOf('tiers.mongodb.minimum');
            var ixMax = metrics.indexOf('tiers.mongodb.maximum');
            t.ok(ixAvg > -1 && metrics.length > ixAvg,
                 'MongoDB avg metric exists.');
            t.ok(ixMin > -1 && metrics.length > ixMin,
                 'MongoDB min metric exists.');
            t.ok(ixMax > -1 && metrics.length > ixMax,
                 'MongoDB max metric exists.');
            t.ok(metrics[ixAvg + 1] > 0, 'MongoDB avg metric is valid.');
            t.ok(metrics[ixMin + 1] > 0, 'MongoDB min metric is valid.');
            t.ok(metrics[ixMax + 1] > 0, 'MongoDB max metric is valid.');
            client.close();
            t.end();
          });
    });
});
