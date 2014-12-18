var addon = require('../lib/addon');
require.cache[require.resolve('../lib/addon')].exports = null;

var agent = require('../');
agent.configure({
  interval: 100,
});
agent.start();

setTimeout(function() {
  console.log('ok - did not crash when addon missing');
}, 500);
