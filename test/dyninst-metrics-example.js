// save as `dyninst-metrics-example.js`
var http = require('http');

http.createServer(request).listen(process.env.PORT || 3000);

function request(req, res) {
  setTimeout(function() { // line 7
    res.end('OK\n'); // line 8
  }, Math.random() > 0.1 ? 10 : 100);
}
