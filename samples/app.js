// Copyright (c) 2014, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

var agent = require('../');
var http = require('http');
var net = require('net');
var path = require('path');

net.createServer(agent.dyninst).listen(7000);
http.createServer(onrequest).listen(8000, onlisten);

function onlisten() {
  console.log('Listening on http://%s:%d/',
              this.address().address,
              this.address().port);
  console.log('Now run `%s %s/di`',
              process.argv[0],
              path.relative(process.cwd(), __dirname) || '.');
}

function onrequest(req, res) {
  res.writeHead(200, { 'Content-Length': '2' });
  res.end('OK');
}
