'use strict';

var maybeSkip = process.env.POSTGRESQL_USER
              ? false
              : {skip: 'Incomplete PostgreSQL environment'};

process.env.STRONGLOOP_LICENSE = require('./helpers').shortTestLicense();

var agent = require('../');
var assert = require('assert');
var tap = require('tap');
var fmt = require('util').format;
var pgCredentials = process.env.POSTGRESQL_USER;
if ((process.env.POSTGRESQL_PASSWORD || '').length > 0) {
  pgCredentials += ':' + process.env.POSTGRESQL_PASSWORD;
}
// template1 db is guaranteed to exist on all posgres servers
var POSTGRESQL_PARAM = fmt('postgres://%s@%s:%d/template1',
                           pgCredentials,
                           process.env.POSTGRESQL_HOST || 'localhost',
                           process.env.POSTGRESQL_PORT || 5432);

var metrics = [];
agent.use(metrics.push.bind(metrics));

agent.error = assert.fail;

var CORRECT_FIELD = 'value';
var CORRECT_RESULT = 42;

tap.test('PostgreSQL probe', maybeSkip, function(t) {
  require('pg').connect(
      POSTGRESQL_PARAM,
      function(err, client, done) {
        var connected = (err == null && client != null);
        t.ok(connected, 'PostgreSQL connected.');
        if (!connected) return t.end();
        client.query(
            'SELECT $1::text AS ' + CORRECT_FIELD, [CORRECT_RESULT],
            function(err, result) {
              var querySuccess = (err == null && result != null);
              t.ok(querySuccess, 'PostgreSQL query result returned.');
              if (!querySuccess) {
                done();
                client.end();
                t.end();
                return;
              }
              t.comment('result: ' + JSON.stringify(result));
              t.equal(result.command,
                  'SELECT', 'PostgreSQL correct command returned');
              t.equal(result.rowCount, 1,
                  'PostgreSQL correct rowCount returned');
              t.equal(result.rows.length, 1,
                  'PostgreSQL correct rows.length returned');
              t.equal(result.fields.length, 1,
                  'PostgreSQL correct fields.length returned');
              t.equal(result.fields[0].name, CORRECT_FIELD,
                  'PostgreSQL correct field name returned');
              t.equal(
                  parseInt(result.rows[0][result.fields[0].name], 10),
                  CORRECT_RESULT,
                  'PostgreSQL correct result returned');
              // verify the recorded PostgreSQL metrics
              agent.poll();
              t.comment('metrics: ' + JSON.stringify(metrics));
              var ixAvg = metrics.indexOf('tiers.postgres.average');
              var ixMin = metrics.indexOf('tiers.postgres.minimum');
              var ixMax = metrics.indexOf('tiers.postgres.maximum');
              t.ok(ixAvg > -1 && metrics.length > ixAvg, 'PostgreSQL avg metric exists.');
              t.ok(ixMin > -1 && metrics.length > ixMin, 'PostgreSQL min metric exists.');
              t.ok(ixMax > -1 && metrics.length > ixMax, 'PostgreSQL max metric exists.');
              t.ok(metrics[ixAvg + 1] > 0, 'PostgreSQL avg metric is valid.');
              t.ok(metrics[ixMin + 1] > 0, 'PostgreSQL min metric is valid.');
              t.ok(metrics[ixMax + 1] > 0, 'PostgreSQL max metric is valid.');
              done();
              client.end();
              t.end();
          });
      });
});
