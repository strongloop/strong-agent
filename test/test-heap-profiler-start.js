process.env.SL_ENV = 'dev';

var agent = require('../');
agent.profile('deadbeef', 'deadbeef', {quiet: true});

var profiler = require('../lib/profilers/memory');
profiler.init(agent, 100);
profiler.start();
