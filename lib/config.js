var extend = require('util')._extend;
var os = require('os');
var INT_MULT = Math.max(1, process.env.STRONGAGENT_INTERVAL_MULTIPLIER | 0);

var cfg = {
  prod: {
    baseInterval: 15 * 1000,
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
    baseInterval: 15 * 1000 / INT_MULT,
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
    baseInterval: 15 * 1000 / INT_MULT,
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
    baseInterval: 1 * 1000 / INT_MULT,
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
  var home =
          process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
      cwd = process.cwd(), nfjson, pkgjson, userjson;

  // Load configs from strongloop.json and package.json
  try {
    nfjson = require(cwd + '/strongloop.json');
  } catch (e) {
    nfjson = {};
  }
  try {
    pkgjson = require(cwd + '/package.json');
  } catch (e) {
    pkgjson = {};
  }
  try {
    userjson = require(home + '/strongloop.json');
  } catch (e) {
    userjson = {};
  }

  var config = {
    key: userKey || env.STRONGLOOP_KEY || env.SL_KEY ||
             env.NODEFLY_APPLICATION_KEY || nfjson.userKey ||
             pkgjson.strongAgentKey ||
             userjson.key ||  // Bug-for-bug backwards compatibility...
             userjson.userKey,

    appName: appName || env.STRONGLOOP_APPNAME || env.SL_APP_NAME ||
                 nfjson.appName || pkgjson.name || userjson.appName,

    license: options.license || env.STRONGLOOP_LICENSE ||
                 env.STRONG_AGENT_LICENSE || nfjson.agent_license,

    host: options.host || defaults.host,

    port: options.port || defaults.port,

    proxy: options.proxy || env.https_proxy || env.HTTPS_PROXY ||
               env.http_proxy || env.HTTP_PROXY || nfjson.proxy ||
               userjson.proxy || defaults.proxy,

    endpoint: options.endpoint || env.STRONGLOOP_ENDPOINT || nfjson.endpoint ||
                  userjson.endpoint || defaults.endpoint,

    // The .collector properties below are directly used as the default by
    // lib/transport.js, and http vs. https is selected based on the
    // transport's
    // endpoint.secure property. The STRONGLOOP_ are for backwards
    // compatibility.
    collector: {
      http: {
        host: process.env.STRONGLOOP_COLLECTOR || defaults.collector.http.host,
        port: process.env.STRONGLOOP_COLLECTOR_PORT ||
                  defaults.collector.http.port,
      },
      https: {
        host: process.env.STRONGLOOP_COLLECTOR_HTTPS ||
                  defaults.collector.https.host,
        port: process.env.STRONGLOOP_COLLECTOR_HTTPS_PORT ||
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

  var result = extend(extend({}, defaults), config);
  if (options.interval) {
    result.baseInterval = options.interval;
  }
  return result;
}

module.exports = defaults;  // remove when global.nodeflyConfig is unused
module.exports.configure = configure;
