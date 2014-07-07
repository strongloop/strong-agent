require('../../').profile('deadbeef', 'deadbeef', { quiet: true });

// Trap lib/proxy's call to agent.error() when the hook errors
global.STRONGAGENT.error = function(err) {
  throw err;
};

var app = require('express')();
var http = require('http');

app.get('/get', function(req, res){
  console.log('at /get:', req.route);
  res.end('ok\n');
});

app.listen(0, function() {
  var server = this;
  http.get({port: server.address().port, path: '/get'}, function (res) {
    res.pipe(process.stdout);
    server.close();
  });
});
