var Transport = require('../lib/transport');
var net = require('net');

var server = net.createServer(function(conn) { conn.destroy(); });

server.listen(0, '127.0.0.1', function() {
  var transport = Transport.init({
    agent: {appName: 'foo', hostname: 'bar'},
    host: this.address().address,
    port: this.address().port,
  });
  this.unref();
});
