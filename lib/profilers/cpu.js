'use strict';

// addon is exposed so it may be monkey-patched by unit tests
exports.addon = require('../addon');

exports.start = function() {
  if (exports.addon) {
    exports.addon.startCpuProfiling();
    exports.enabled = true;
    return true;
  } else {
    return false;
  }
};

exports.stop = function() {
  exports.enabled = false;
  return exports.addon && exports.addon.stopCpuProfiling();
};
