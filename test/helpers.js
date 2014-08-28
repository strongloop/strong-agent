var fmt = require('util').format;
var license = require('../lib/license');

module.exports = {
  expectantLogger: expectantLogger,
  noop: function noop() {},
  shortTestLicense: shortTestLicense,
  longTestLicense: longTestLicense,
  invalidLicense: function() { return 'invalid license key'; },
};

function expectantLogger(positives, negatives, done) {
  positives = (positives || []).map(function(e) { return new RegExp(e); });
  negatives = (negatives || []).map(function(e) { return new RegExp(e); });

  return function(logmsg) {
    logmsg = fmt.apply(null, arguments);
    console.log(logmsg);
    if (negatives.some(function(e) { return e.test(logmsg)})) {
      return done(Error('negative test matched: ' + logmsg));
    }
    positives = positives.filter(function(expected) {
      return !expected.test(logmsg);
    });
    if (positives.length === 0){
      done();
    }
  }
}

function shortTestLicense(features) {
  return license({
    product: 'agent',
    features: features || ['*'],
    activationDate: new Date(Date.now() - 1000),
    expirationDate: new Date(Date.now() + 5*60*1000),
  }).key;
}

function longTestLicense(features) {
  return license({
    product: 'agent',
    features: features || ['*'],
    activationDate: new Date(Date.now() - 1000),
    expirationDate: new Date(Date.now() + 24*60*60*1000),
  }).key;
}
