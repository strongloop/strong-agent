var agent = require('../');
var assert = require('assert');

var messages = [];
console.log = messages.push.bind(messages);
console.info = messages.push.bind(messages);
console.error = messages.push.bind(messages);
agent.profile(undefined, undefined, {quiet: false});
assert(messages.length > 0);
