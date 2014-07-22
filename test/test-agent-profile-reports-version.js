var assert = require('assert');
var util = require('util');

var v = require('../package.json').version;
var vMatch = new RegExp('v' + v.replace(/\./g, '\\.'));

var logger = {
  log: expectVersion,
  info: noop,
  warn: noop,
  error: noop,
};

var agent = require('../');
agent.profile('some key', 'some name', { logger: logger });

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
