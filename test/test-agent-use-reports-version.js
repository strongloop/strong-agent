var assert = require('assert');
var helpers = require('./helpers');
var util = require('util');

var v = require('../package.json').version;
var vMatch = new RegExp('v' + v.replace(/\./g, '\\.'));

var logger = {
  log: expectVersion,
  info: noop,
  warn: noop,
  error: noop,
};

process.env.STRONG_AGENT_LICENSE = helpers.shortTestLicense();
var agent = require('../');
agent.config.logger = logger;
agent.use(function noop() {});

setTimeout(fail, 2000);

function expectVersion(logmsg) {
  logmsg = util.format.apply(null, arguments);
  console.log(logmsg);
  if (vMatch.test(logmsg))
    success();
}

function noop() { }

function success() {
  console.log('# version reported');
  process.exit(0);
}

function fail() {
  console.log('# version not reported.');
  process.exit(1);
}
