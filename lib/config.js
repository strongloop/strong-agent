'use strict';

var extend = require('util')._extend;
var os = require('os');

var defaults = {
  baseInterval: 15 * 1000,
};

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
  var slLicenses;

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
  try {
    // this is normally done by strongloop-license, but its API
    // isn't quite flexible enough to use in strong-agent yet
    slLicenses = require(home + '/.strongloop/licenses.json')
                    .licenses.map(function(l) {
                      return l.licenseKey;
                    });
  } catch (e) {
    slLicenses = [];
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
                 env.STRONG_AGENT_LICENSE || nfjson.agent_license || '',

    logger: options.logger || console,
  };

  // add licenses found in ~/.strongloop/licenses.json
  // and make config.license an Array of licenses
  config.license = (config.license || '').split(':')
                      .concat(slLicenses)
                      .filter(function(l) {
                        return !!l;
                      });

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

module.exports = defaults;
module.exports.configure = configure;
