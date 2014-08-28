var assert = require('assert');
var async = require('async');
var util = require('util');
var helpers = require('./helpers');
var agent = require('../');

var tests = [
  { env: { STRONG_AGENT_LICENSE: helpers.invalidLicense(), STRONGLOOP_KEY: 'valid key' },
    expect: [
      'agent metrics license not found, local reporting disabled',
      'started profiling agent',
    ]
  },
  { env: { STRONG_AGENT_LICENSE: helpers.shortTestLicense(), STRONGLOOP_KEY: undefined },
    expect: [
      'API key not found, StrongOps dashboard reporting disabled',
      'started profiling agent',
    ],

  },
  { env: { STRONG_AGENT_LICENSE: helpers.invalidLicense(), STRONGLOOP_KEY: undefined },
    expect: [
      'not profiling, agent metrics requires a valid license',
      'not profiling, StrongOps configuration not found',
    ],
    notExpect: ['started profiling agent'],
  },
  { env: { STRONG_AGENT_LICENSE: helpers.shortTestLicense(), STRONGLOOP_KEY: 'valid key' },
    expect: [
      'started profiling agent',
    ]
  },
];

async.eachSeries(tests, runTest, done);

function runTest(test, cb) {
  process.env.STRONG_AGENT_LICENSE = test.env.STRONG_AGENT_LICENSE;
  if (test.env.STRONGLOOP_KEY)
    process.env.STRONGLOOP_KEY = test.env.STRONGLOOP_KEY;
  else
    delete process.env.STRONGLOOP_KEY;

  var log = helpers.expectantLogger(test.expect, test.notExpect, cb);
  agent.stop();
  agent.profile(null, 'some name', {
    logger: {
      log: log,
      info: log,
      warn: helpers.noop,
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
