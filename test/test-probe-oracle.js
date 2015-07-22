'use strict';

if (!('ORACLE_USER' in process.env) || !('ORACLE_PASSWORD' in process.env)) {
  console.log('1..0 # SKIP ORACLE_USER or ORACLE_PASSWORD ' +
    'not set in process.env');
  return;
}

if (!('ORACLE_HOST' in process.env) || !('ORACLE_PORT' in process.env) ||
    !('ORACLE_DB' in process.env)) {
  console.log('1..0 # SKIP ORACLE_HOST or ORACLE_PORT or ORACLE_DB ' +
    'not set in process.env');
  return;
}

process.env.STRONGLOOP_LICENSE = require('./helpers').longTestLicense();

var agent = require('../');
var assert = require('assert');
var tap = require('tap');

var metrics = [];
agent.use(metrics.push.bind(metrics));

agent.error = assert.fail;

var oracle_connection_data = {
  host: process.env.ORACLE_HOST,
  port: process.env.ORACLE_PORT,
  database: process.env.ORACLE_DB,
  username: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD
};

var drivers = [
  {
    linkName: 'Oracledb',
    conn: null,
    result: null
  },
  {
    linkName: 'Oracle',
    conn: null,
    result: null
  }
];

var CORRECT_RESULT = 42;

tap.test('Oracle probes', function(tt) {
  drivers.forEach(function(d) {
    var maybeSkip = {};
    if (d.linkName === 'Oracle' && process.platform === 'win32') {
      maybeSkip.skip = 'skipping strong-oracle on Windows';
    }

    tt.test('Connecting to ' + d.linkName, maybeSkip, function(t) {
      if (d.linkName === 'Oracle') {
        require('strong-oracle')({}).connect(
          oracle_connection_data, function(err, conn) {
            d.conn = err ? null : conn;
            t.end(); // connection
          });
      } else if (d.linkName === 'Oracledb') {
        require('oracledb').getConnection(
          {user: oracle_connection_data.username,
          password: oracle_connection_data.password,
          connectString: oracle_connection_data.host + ':' + 
              oracle_connection_data.port + '/' +
              oracle_connection_data.database
          }, function(err, conn) {
            d.conn = err ? null : conn;
            t.end(); // connection
          });
      }
    });

    tt.test('Query with ' + d.linkName, maybeSkip, function(t) {
      if (!d.conn) {
        t.comment('Query test skipped because connection failed with ' +
            d.linkName + ' driver.');
        t.end();
        return;
      }
      var query = 'SELECT ' + CORRECT_RESULT + ' as PARAM FROM dual';
      d.conn.execute(query, [],
        function(err, result) {
          t.equal(d.result, null, 'Query with ' + d.linkName +
              ' driver executed only once.');
          if (!err) {
            if (d.linkName === 'Oracle') d.result = result[0].PARAM;
            if (d.linkName === 'Oracledb') d.result = result.rows[0][0];
            t.equal(d.result, CORRECT_RESULT, d.linkName +
                ' driver returned the correct result.');
          } else {
            d.result = null;
          }
          t.end(); // query
      });
    });

    tt.test('Metrics check with ' + d.linkName, maybeSkip, function(t) {
      if (d.conn && d.linkName === 'Oracle') d.conn.close();
      if (!d.result) {
        t.comment('Metrics check skipped because query failed with '
            + d.linkName + ' driver.');
        t.end();
        return;
      }
      agent.poll();
      var ixAvg = metrics.indexOf('tiers.oracle.average');
      var ixMin = metrics.indexOf('tiers.oracle.minimum');
      var ixMax = metrics.indexOf('tiers.oracle.maximum');
      t.ok(ixAvg > -1 && metrics.length > ixAvg, 'Avg metric exists.');
      t.ok(ixMin > -1 && metrics.length > ixMin, 'Min metric exists.');
      t.ok(ixMax > -1 && metrics.length > ixMax, 'Max metric exists.');
      t.ok(metrics[ixAvg + 1] > 0, 'Avg metric is valid.');
      t.ok(metrics[ixMin + 1] > 0, 'Min metric is valid.');
      t.ok(metrics[ixMax + 1] > 0, 'Mix metric is valid.');
      t.end();
    });

  });
  tt.end();
});
