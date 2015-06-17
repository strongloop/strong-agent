'use strict';

if (!('MYSQL_USER' in process.env) || !('MYSQL_PASSWORD' in process.env)) {
  console.log('ok # SKIP MYSQL_USER or MYSQL_PASSWORD not set in environment');
  return;
}

process.env.STRONGLOOP_LICENSE = require('./helpers').longTestLicense();

var agent = require('../');
var assert = require('assert');

var metrics = [];
agent.use(metrics.push.bind(metrics));

agent.error = assert.fail;  // Fail if mysql probe squeals.
var mysql = require('mysql');
var conn = mysql.createConnection({
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
});
conn.connect();

var numcalls = 0;
conn.query('SELECT 42 AS result', function(err, rows, fields) {
  assert.equal(err, null);
  assert.equal(rows.length, 1);
  assert.equal(fields.length, 1);
  assert.equal(rows[0].result, 42);
  conn.end();
  numcalls += 1;
});

process.on('exit', function() {
  assert.equal(numcalls, 1);
  agent.poll();
  var avg = metrics.indexOf('tiers.mysql.average');
  var min = metrics.indexOf('tiers.mysql.minimum');
  var max = metrics.indexOf('tiers.mysql.maximum');
  assert.notEqual(avg, -1);
  assert.notEqual(min, -1);
  assert.notEqual(max, -1);
  assert(metrics[avg + 1] > 0);
  assert(metrics[min + 1] > 0);
  assert(metrics[max + 1] > 0);
});
