'use strict';

var maybeSkip = process.env.POSTGRESQL_USER
              ? false
              : {skip: 'Incomplete PostgreSQL environment'};

process.env.STRONGLOOP_LICENSE = require('./helpers').shortTestLicense();

var agent = require('../');
var assert = require('assert');
var tap = require('tap');

var metrics = [];
agent.use(metrics.push.bind(metrics));

agent.error = assert.fail;

tap.test('DAO Juggler probe', maybeSkip, function(t) {
  var DataSource = require('loopback-datasource-juggler').DataSource;
  var config = {
    'host': process.env.POSTGRESQL_HOST || 'localhost',
    'port': process.env.POSTGRESQL_PORT || 5432,
    'username': process.env.POSTGRESQL_USER,
    'password': process.env.POSTGRESQL_PASSWORD || '',
    'database': 'template1',
  };
  var ds = new DataSource(
      require('loopback-connector-postgresql'), config);
  var Account = ds.createModel('account', {
    name: String,
    emails: [String],
    age: Number},
    {strict: true});
  ds.automigrate('account', function(err) {
    Account.create({
      name: 'John1',
      emails: ['john@x.com', 'jhon@y.com'],
      age: 30
    }, function (err, result) {
      var querySuccess = (err == null && result != null);
      t.ok(querySuccess, 'DAO Juggler create result returned.');
      if (!querySuccess) {
        ds.disconnect();
        t.end();
        return;
      }
      t.comment('result: ' + JSON.stringify(result.toObject()));
      agent.poll();
      t.comment('metrics: ' + JSON.stringify(metrics));
      // verify the recorded PostgreSQL metrics
      var ixAvg = metrics.indexOf('tiers.postgres.average');
      var ixMin = metrics.indexOf('tiers.postgres.minimum');
      var ixMax = metrics.indexOf('tiers.postgres.maximum');
      t.ok(ixAvg > -1 && metrics.length > ixAvg,
          'PostgreSQL avg metric exists.');
      t.ok(ixMin > -1 && metrics.length > ixMin,
          'PostgreSQL min metric exists.');
      t.ok(ixMax > -1 && metrics.length > ixMax,
          'PostgreSQL max metric exists.');
      t.ok(metrics[ixAvg + 1] > 0, 'PostgreSQL avg metric is valid.');
      t.ok(metrics[ixMin + 1] > 0, 'PostgreSQL min metric is valid.');
      t.ok(metrics[ixMax + 1] > 0, 'PostgreSQL max metric is valid.');
      // verify the recorded DAO metrics
      var ixAvg = metrics.indexOf('tiers.dao.average');
      var ixMin = metrics.indexOf('tiers.dao.minimum');
      var ixMax = metrics.indexOf('tiers.dao.maximum');
      t.ok(ixAvg > -1 && metrics.length > ixAvg, 'DAO avg metric exists.');
      t.ok(ixMin > -1 && metrics.length > ixMin, 'DAO min metric exists.');
      t.ok(ixMax > -1 && metrics.length > ixMax, 'DAO max metric exists.');
      t.ok(metrics[ixAvg + 1] > 0, 'DAO avg metric is valid.');
      t.ok(metrics[ixMin + 1] > 0, 'DAO min metric is valid.');
      t.ok(metrics[ixMax + 1] > 0, 'DAO max metric is valid.');
      ds.disconnect();
      t.end();
    });
  });
});
