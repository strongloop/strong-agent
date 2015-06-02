process.env.SL_ENV = '';

var assert = require('assert');
var async = require('async');
var util = require('util');
var helpers = require('./helpers');
var agent = require('../');
var path = require('path');

// Patch package.json to stop strong-agent from fetching the app name from it.
var filename = path.join(__dirname, '../package.json');
require(filename);
require.cache[filename].exports.name = '';

// Prevent lib/config from loading valid licenses from the home directory.
process.env.HOME = '/no/home/directory';

var tests = [
  {
    name: 'a',
    env: {
      STRONGLOOP_LICENSE: helpers.invalidLicense(),
      STRONGLOOP_APPNAME: 'valid app',
      STRONGLOOP_KEY: 'valid key'
    },
    expect: [
      'agent metrics license not found, local reporting disabled',
      'started profiling agent',
    ]
  },
  {
    name: 'b',
    env: {
      STRONGLOOP_LICENSE: helpers.shortTestLicense(),
      STRONGLOOP_APPNAME: 'valid app',
      STRONGLOOP_KEY: undefined
    },
    expect: [
      'started profiling agent',
    ],
  },
  {
    name: 'c',
    env: {
      STRONGLOOP_LICENSE: helpers.shortTestLicense(),
      STRONGLOOP_APPNAME: undefined,
      STRONGLOOP_KEY: 'valid key'
    },
    expect: [
      'Application name not found, StrongOps dashboard reporting disabled',
      'started profiling agent',
    ],
  },
  {
    name: 'd',
    env: {
      STRONGLOOP_LICENSE: helpers.invalidLicense(),
      STRONGLOOP_APPNAME: undefined,
      STRONGLOOP_KEY: undefined
    },
    expect: [
    ],
    notExpect: ['started profiling agent'],
  },
  {
    name: 'e',
    env: {
      STRONGLOOP_LICENSE: helpers.shortTestLicense(),
      STRONGLOOP_APPNAME: 'valid app',
      STRONGLOOP_KEY: 'valid key'
    },
    expect: ['started profiling agent', ]
  },
];

async.eachSeries(tests, runTest, done);

function runTest(test, cb) {
  console.log('### test: ', test.name);
  process.env.STRONGLOOP_LICENSE = test.env.STRONGLOOP_LICENSE;
  ['STRONGLOOP_APPNAME', 'STRONGLOOP_KEY'].forEach(function(key) {
    if (test.env[key])
      process.env[key] = test.env[key];
    else
      delete process.env[key];
  });

  var log = helpers.expectantLogger(test.expect, test.notExpect, cb);
  agent.stop();
  // reset licenses, otherwise they accumulate
  agent.licenses = [];
  agent.profile(null, null, {
    logger: {
      log: log,
      info: log,
      warn: log,
      error: helpers.noop,
    }
  });
  agent.use(helpers.noop);
}

setTimeout(done.bind(null, Error('timed out waiting for log messages')), 5000);

function done(err) {
  assert.ifError(err);
  process.exit(0);
}
