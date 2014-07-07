// Common debug wrapper. Its used by modules that do not have a reference to the
// agent object, or want to debug under a particular section.
//
// Usage:
//
//   // In greetings module
//   var debug = require('./debug')('greeter');
//
//   debug('yo, eh');
//
// Enable friendly greeting with one of:
//   DEBUG='*'
//   DEBUG='strong-agent:*'
//   DEBUG='strong-agent:greeter'
//
// To avoid expensive argument preparation, you can do:
//
//   var debug = require('./debug')('section');
//
//   if (debug.enabled) {
//     debug('%s', prepData()); // avoid prepData call if possible
//   }
var debug = require('debug');

module.exports = function(section) {
  var specification = 'strong-agent';

  if (section) {
    specification += ':' + section;
  }

  return debug(specification);
};
