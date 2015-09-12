'use strict';

require('../').use(function() {});

var expectedError = Error('expected error');

function RedisClient() {}
RedisClient.prototype.send_command = function(fst, snd) {
  if (!Array.isArray(snd)) throw expectedError;
}

var redis = { RedisClient: RedisClient };
require.cache['redis'] = { exports: redis };
require('../lib/probes/redis')(redis);

try {
  (new RedisClient).send_command();
} catch (e) {
  if (e === expectedError) return;
  throw e;
}

throw Error('expected exception missing');
