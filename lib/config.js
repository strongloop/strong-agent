var extend = require('underscore').extend;
var os = require('os');
var INT_MULT = Math.max(1, process.env.STRONGAGENT_INTERVAL_MULTIPLIER | 0);

var cfg = {
  prod: {
    collectInterval: 60 * 1000,
    heapDiffInterval: 15 * 1000,
    metricsInterval: 60 * 1000,
    tiersInterval: 60 * 1000,
    loopInterval: 60 * 1000,
    countsInterval: 60 * 1000,
    senderInterval: 1000,
    collector: {
      http: {
        host: 'collector.strongloop.com',
        port: 80,
      },
      https: {
        host: 'collector.strongloop.com',
        port: 443,
      },
    }
  },
  staging: {
    collectInterval: 60 * 1000 / INT_MULT,
    heapDiffInterval: 15 * 1000 / INT_MULT,
    metricsInterval: 60 * 1000 / INT_MULT,
    tiersInterval: 60 * 1000 / INT_MULT,
    loopInterval: 60 * 1000 / INT_MULT,
    countsInterval: 60 * 1000 / INT_MULT,
    senderInterval: 1000 / INT_MULT,
    collector: {
      http: {
        host: 'collector-staging.strongloop.com',
        port: 80,
      },
      https: {
        host: 'collector-staging.strongloop.com',
        port: 443,
      },
    }
  },
  dev: {
    collectInterval: 15 * 1000 / INT_MULT,
    heapDiffInterval: 15 * 1000 / INT_MULT,
    metricsInterval: 15 * 1000 / INT_MULT,
    tiersInterval: 15 * 1000 / INT_MULT,
    loopInterval: 15 * 1000 / INT_MULT,
    countsInterval: 15 * 1000 / INT_MULT,
    senderInterval: 250 / INT_MULT,
    collector: {
      http: {
        host: '127.0.0.1',
        port: 8080,
      },
      https: {
        host: '127.0.0.1',
        port: 8443,
      },
    }
  },
  test: {
    collectInterval: 1 * 1000 / INT_MULT,
    heapDiffInterval: 1 * 1000 / INT_MULT,
    metricsInterval: 1 * 1000 / INT_MULT,
    tiersInterval: 1 * 1000 / INT_MULT,
    loopInterval: 1 * 1000 / INT_MULT,
    countsInterval: 1 * 1000 / INT_MULT,
    senderInterval: 100 / INT_MULT,
    collector: {
      http: {
        host: '127.0.0.1',
        port: 8080,
      },
      https: {
        host: '127.0.0.1',
        port: 8443,
      },
    }
  },
};

var defaults = cfg[process.env.SL_ENV || 'prod'] || cfg.prod;

/**
 * Cascading config loader
 *
 * Search order:
 *   arguments
 *   process.env
 *   ./strongloop.json
 *   ./package.json
 *   ~/strongloop.json
 *
 * @param   {string} [key]      [API Key]
 * @param   {string} [appName]  [Name to identify app with in dashboard]
 * @returns {object} [Returns config data]
 */
function configure(userKey, appName, options, env) {
  var home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
    , cwd = process.cwd()
    , nfjson
    , pkgjson
    , userjson;

  // Load configs from strongloop.json and package.json
  try { nfjson = require(cwd + '/strongloop.json'); } catch (e) { nfjson = {}; }
  try { pkgjson = require(cwd + '/package.json'); } catch (e) { pkgjson = {}; }
  try { userjson = require(home + '/strongloop.json'); } catch (e) { userjson = {}; }

  var config = {
    key:
      userKey ||
      env.STRONGLOOP_KEY ||
      env.SL_KEY ||
      env.NODEFLY_APPLICATION_KEY ||
      nfjson.userKey ||
      pkgjson.strongAgentKey ||
      userjson.key ||  // Bug-for-bug backwards compatibility...
      userjson.userKey,

    appName:
      appName ||
      env.STRONGLOOP_APPNAME ||
      env.SL_APP_NAME ||
      nfjson.appName ||
      pkgjson.name ||
      userjson.appName,

    host:
      options.host ||
      defaults.host,

    port:
      options.port ||
      defaults.port,

    proxy:
      options.proxy ||
      env.https_proxy || env.HTTPS_PROXY ||
      env.http_proxy || env.HTTP_PROXY ||
      nfjson.proxy ||
      userjson.proxy ||
      defaults.proxy,

    endpoint:
      options.endpoint ||
      env.STRONGLOOP_ENDPOINT ||
      nfjson.endpoint ||
      userjson.endpoint ||
      defaults.endpoint,

    // The .collector properties below are directly used as the default by
    // lib/transport.js, and http vs. https is selected based on the transport's
    // endpoint.secure property. The STRONGLOOP_ are for backwards
    // compatibility.
    collector: {
      http: {
        host:
          process.env.STRONGLOOP_COLLECTOR ||
          defaults.collector.http.host,
        port:
          process.env.STRONGLOOP_COLLECTOR_PORT ||
          defaults.collector.http.port,
      },
      https: {
        host:
          process.env.STRONGLOOP_COLLECTOR_HTTPS ||
          defaults.collector.https.host,
        port:
          process.env.STRONGLOOP_COLLECTOR_HTTPS_PORT ||
          defaults.collector.https.port,
      },
    },

    logger: options.logger || console,
  };

  appName = config.appName;

  if (appName instanceof Array) {
    config.appName = appName.shift();
    config.hostname = appName.join(':');
  } else {
    config.hostname = os.hostname();
  }

  return extend({}, defaults, config);
}

module.exports = defaults; // remove when global.nodeflyConfig is unused
module.exports.configure = configure;
