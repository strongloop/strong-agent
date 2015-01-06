process.env.SL_ENV = 'dev';

var agent = require('../');
var assert = require('assert');
var http = require('http');
var json = require('../lib/json');

var collector =
    http.createServer(
             function(req, res) {
               assert.equal(req.url, '/agent/v1');
               req.pipe(json.JsonDecoder()).once('data', function(data) {
                 assert.equal(data.appName, 'some app');
                 assert.equal(data.hostname, 'some host');
                 assert.equal(/\d\.\d\.\d/.test(data.agentVersion), true);
                 assert.equal(data.key, 'some key');
                 assert.equal(typeof(data.pid), 'number');
                 collector.close();
                 agent.stop();
                 res.end();
               });
             }).listen(0, '127.0.0.1', function() {
  var options = {
    endpoint: {
      host: collector.address().address,
      port: collector.address().port,
      secure: false,
    },
    quiet: true,
  };
  agent.profile('some key', ['some app', 'some host'], options);
});
