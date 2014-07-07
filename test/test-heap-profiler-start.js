process.env.SL_ENV = 'dev';
require('../').profile('deadbeef', 'deadbeef', { quiet: true });

var profiler = require('../lib/profilers/memory');
profiler.init();
profiler.start();
