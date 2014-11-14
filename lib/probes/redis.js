var agent = require('../agent');
var debug = require('../debug')('probes:redis');
var proxy = require('../proxy');
var samples = require('../samples');
var counts = require('../counts');
var tiers = require('../tiers');
var topFunctions = require('../top-functions');
var graphHelper = require('../graph-helper');

module.exports = function(redis) {

  proxy.before(redis.RedisClient.prototype, 'send_command',
               function(obj, args, ret) {
    if (agent.paused) return;

    var command = args[0];
    var input = args[1];

    if (!Array.isArray(input)) return;

    var timer = samples.timer('Redis', command);
    var query = command +
                (typeof input[0] === 'string' ? ' "' + input[0] + '"' : '');
    var graphNode = graphHelper.startNode('Redis', query, agent);

    counts.sample('redis');
    debug('command: %s', command);

    function handle(obj, args, extra) {
      timer.end();

      debug('%s callback', command);
      topFunctions.add('redisCalls', query, timer.ms);
      graphHelper.updateTimes(graphNode, timer);

      if (extra) {
        debug('%s extra: ', extra);
        extra.redis = extra.redis || 0;
        extra.redis += timer.ms;
        tiers.sample(extra.closed ? 'redis_out' : 'redis_in', timer);
      } else {
        tiers.sample('redis_in', timer);
      }
    }

    // Support send_command(com, [arg, cb]) and send_command(com, [arg], cb)
    var callbackIndex = args.length - 1;
    if (typeof args[callbackIndex] === 'function') {
      proxy.callback(args, callbackIndex, handle);
    } else {
      // Hack to support optional functions by adding noop function when
      // blank
      callbackIndex = input.length - 1;
      if (typeof input[callbackIndex] !== 'function') {
        input.push(function() {});
        callbackIndex += 1;
      }
      proxy.callback(input, callbackIndex, handle);
    }

    if (graphNode) agent.currentNode = graphNode.prevNode;
  });
};
