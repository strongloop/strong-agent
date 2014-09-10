'use strict';

process.env.SL_ENV = 'dev';
require('../lib/config').collectInterval = 50;
require('../').profile('deadbeef', 'deadbeef', {quiet: true});

var assert = require('assert');
var http = require('http');
var net = require('net');
var agent = require('../');

assert.equal(http.Server.prototype.on, http.Server.prototype.addListener);

http.createServer(assert.fail).listen(0, '127.0.0.1', function() {
  var kContextPropertyName = '__STRONGOPS_HTTP_CONTEXT__';
  assert.equal(this, agent.httpServer);
  assert.equal(this.hasOwnProperty(kContextPropertyName), true);
  assert.equal(this[kContextPropertyName].connectionCounts[0], 0);
  this.on('upgrade', function(req, conn, head) {
    assert.equal(this[kContextPropertyName].connectionCounts[0], 1);
    seenUpgrade = true;
    conn.destroy();
    this.close();
  });
  net.connect({
                host: this.address().address,
                port: this.address().port,
              },
              function() {
    this.write('GET / HTTP/1.1\r\n' +
               'Upgrade: Yes, please.\r\n' +
               '\r\n');
  });
});

process.on('exit', function() { assert.equal(seenUpgrade, true); });
var seenUpgrade = false;
