'use strict';

try {
  module.exports = require('../build/Release/strong-agent');
} catch (e) {
  try {
    module.exports = require('../build/Debug/strong-agent');
  } catch (e) {
    module.exports = null;
  }
}
