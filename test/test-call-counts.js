process.env.SL_ENV = 'dev';
process.env.STRONGAGENT_INTERVAL_MULTIPLIER = 1000;

var assert = require('assert');

var N = 1e3;
var counts = {
  'mongodb.average': 0,
  'mongodb.count': 0,
  'mongodb.maximum': 0,
  'mongodb.minimum': 0,
  'mysql.average': 0,
  'mysql.count': 0,
  'mysql.maximum': 0,
  'mysql.minimum': 0,
  'redis.average': 0,
  'redis.count': 0,
  'redis.maximum': 0,
  'redis.minimum': 0,
};
process.once('exit', function() {
  Object.keys(counts).forEach(function(name) {
    if (/\.count$/.test(name)) {
      assert.equal(counts[name], N);
      return;
    }
    if (/^(mongodb|mysql|redis)\.(average|maximum|minimum)$/.test(name)) {
      // Mean/min/max query time should certainly be no more than 10 ms in this
      // test.  The value can be zero because query times are truncated to four
      // digits after the dot.
      var value = counts[name];
      assert(value >= 0);
      assert(value <= 10);
      return;
    }
    throw Error('unexpected key: ' + name);
  });
});

require('../').use(function(name, value) {
  if (name in counts) counts[name] += value;
});

function Connection() {}
Connection.prototype.query = function(_, cb) { cb(); }

function Db() {}
Db.prototype._executeQueryCommand = function(_, cb) { cb(); };

function RedisClient() {}
RedisClient.prototype.send_command = function(_, args, cb) {
  if (cb) cb(); else args[0]();
};

var mongodb = { Db: Db };
require.cache['mongodb'] = { exports: mongodb };
require('../lib/probes/mongodb')(mongodb);

var mysql = {};
var child = { exports: Connection, id: 'mysql/lib/Connection.js' };
require.cache['mysql'] = { children: { child: child }, exports: mysql };
require('../lib/probes/mysql')(mysql);

var redis = { RedisClient: RedisClient };
require.cache['redis'] = { exports: redis };
require('../lib/probes/redis')(redis);

for (var i = 0; i < N; i += 1) {
  var mysqlCount = 0;
  var mongoCount = 0;
  var redisCount = 0;
  (new Connection).query('', function() { mysqlCount += 1; });
  (new Db)._executeQueryCommand('', function() { mongoCount += 1; });
  if (i & 1) {
    (new RedisClient).send_command('', [function() { redisCount += 1; }]);
  } else {
    (new RedisClient).send_command('', [], function() { redisCount += 1; });
  }
  assert.equal(mysqlCount, 1);
  assert.equal(mongoCount, 1);
  assert.equal(redisCount, 1);
}

setTimeout(function() {}, 1);
