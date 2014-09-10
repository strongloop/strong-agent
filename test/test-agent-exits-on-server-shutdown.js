process.env.SL_ENV = 'dev';
require('../').profile('deadbeef', 'deadbeef', {quiet: true});
require('net').createServer().listen(0, function() { this.close(); });
