'use strict';

var debug = require('../lib/debug')('test');
var fmt = require('util').format;
var license = require('../lib/license');

module.exports = {
  expectantLogger: expectantLogger,
  noop: function noop() {},
  shortTestLicense: shortTestLicense,
  longTestLicense: longTestLicense,
  invalidLicense: function() { return 'invalid license key'; },
  installPackage: installPackage,
};

function expectantLogger(positives, negatives, done) {
  positives = (positives || []).map(function(e) { return new RegExp(e); });
  negatives = (negatives || []).map(function(e) { return new RegExp(e); });

  return function(logmsg) {
    logmsg = fmt.apply(null, arguments);
    debug('expectant: <%s>', logmsg);
    if (negatives.some(function(e) { return e.test(logmsg) })) {
      return done(Error('negative test matched: ' + logmsg));
    }
    positives =
        positives.filter(function(expected) { return !expected.test(logmsg); });
    debug('expectant: %s', positives);
    if (positives.length === 0) {
      done();
    }
  }
}

function shortTestLicense(features) {
  return license({
                   product: 'agent',
                   features: features || ['*'],
                   activationDate: new Date(Date.now() - 1000),
                   expirationDate: new Date(Date.now() + 5 * 60 * 1000),
                 }).key;
}

function longTestLicense(features) {
  return license({
                   product: 'agent',
                   features: features || ['*'],
                   activationDate: new Date(Date.now() - 1000),
                   expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
                 }).key;
}

function installPackage(name, cont) {
  var spawn = require('child_process').spawn;
  var options = {
    cwd: __dirname + '/..',
    env: process.env,
    stdio: 'inherit',
  };
  var cmd = 'npm';
  if (process.platform === 'win32') {
    var path = require('path');
    cmd = path.join(path.dirname(process.execPath), 'npm.cmd');
  }
  var proc = spawn(cmd, ['install', name], options);
  proc.once('exit', function(exitCode, exitSignal) {
    if (exitCode === 0 && exitSignal === null) {
      cont(null);
    } else {
      cont(new Error('"npm install ' + name + '" failed with exit code ' +
                     exitCode + ', signal ' + exitSignal));
    }
  });
}
