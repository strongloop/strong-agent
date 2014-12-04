var assert = require('assert');
process.env.STRONGLOOP_APPNAME = 'test-app-34';
var agent = require('../');

assert.strictEqual(agent, STRONGAGENT, 'exported agent same as global');
assert.strictEqual(agent.config.appName, 'test-app-34', 'app name from env');
assert(!agent.started, 'agent is not running');

process.env.STRONGLOOP_APPNAME = 'updated-env';
agent.configure();
assert.strictEqual(agent, STRONGAGENT, 'exported agent same as global');
assert.strictEqual(agent.config.appName, 'updated-env', 'app name from env');
assert(!agent.started, 'agent still not running');

agent.configure({ appName: 'override-name', apiKey: 'StrongOps key' });
assert.strictEqual(agent, STRONGAGENT, 'exported agent same as global');
assert.strictEqual(agent.config.appName, 'override-name', 'app name from env');
assert.strictEqual(agent.config.key, 'StrongOps key', 'app name from env');
assert(!agent.started, 'agent still not running');
