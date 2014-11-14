var License = require('strong-license');

module.exports = load;

function load(key) {
  var license = new License(key, 'c374fa24098c7eb64a73dc05c428be40');
  if (process.env.SL_ENV === 'dev' || process.env.SL_ENV === 'test') {
    license.allows = function() { return true; };
  } else {
    license.allows = allows;
  }
  return license;
}

function allows(feature) { return this.covers('agent', feature, new Date()); }
