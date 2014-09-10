'use strict';

process.env.SL_ENV = 'dev';

var agent = require('../');
var assert = require('assert');
var http = require('http');
var url = require('url');

var statusCodes = [401, 407];
var proxy = http.createServer(function(req, res) {
  assert.equal(req.headers['proxy-authorization'],
               'Basic ' + Buffer('user:pass').toString('base64'));
  res.writeHead(statusCodes.shift(),
                {'Proxy-Authenticate': 'Basic realm="proxy"'});
  res.end('VERBOTEN');
});

proxy.listen(0, '127.0.0.1', function() {
  agent.profile('some app', 'some key', {
    proxy: 'http://user:pass@127.0.0.1:' + proxy.address().port + '/',
  });
  var warnings = 0;
  agent.transport.warn = function(s) {
    if (/proxy authentication error/.test(s)) warnings += 1;
    if (statusCodes.length === 0) proxy.close();
  };
  process.on('exit', function() {
    assert.equal(warnings, 2);
    assert.equal(statusCodes.length, 0);
  });
});
