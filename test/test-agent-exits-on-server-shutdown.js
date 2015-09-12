'use strict';

require('../').profile('deadbeef', 'deadbeef', {quiet: true});
require('net').createServer().listen(0, function() { this.close(); });
