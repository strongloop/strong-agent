var assert = require('assert');
var defaults = require('../lib/config');
var config = defaults.configure(null, null, {}, {});

delete defaults.configure;
delete config.configure;

// assert and delete configuration properties that have no defaults
function assertExists(name) {
  assert(name in config);
  delete config[name];
}
assertExists('appName');
assertExists('logger');
assertExists('key');
assertExists('hostname');
assertExists('license');

// all other keys must exist in defaults, and in the config object (which has
// had options and environment applied to configuration, based on defaults)
var defaultKeys = Object.keys(defaults).sort();
var configKeys = Object.keys(config).sort();
console.log('defaults: %j', defaultKeys);
console.log('configed: %j', configKeys);
assert.deepEqual(configKeys, defaultKeys);
