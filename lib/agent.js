if ('STRONGAGENT' in global) {
  module.exports = global.STRONGAGENT;
  return;
}

var assert = require('assert');
var fs = require('fs');
var util = require('util');
var events = require('events');
var semver = require('semver');

var addon = require('./addon');
var customStats = require('./custom-stats');
var debug = require('./debug')();  // DEBUG=strong-agent
var defaults = require('./config');
var dyninst = require('./dyninst');
var dyninstMetrics = require('./dyninst-metrics');
var json = require('./json');
var loadLicense = require('./license');
var proxy = require('./proxy');
var sender = require('./sender');
var counts = require('./counts');
var info = require('./info');
var metrics = require('./metrics');
var transport = require('./transport');
var loop = require('./loop');
var moduleDetector = require('./module-detector');
var topFunctions = require('./top-functions');

// Profilers
var cpuProf = require('./profilers/cpu');
var memProf = require('./profilers/memory');

var tiers = require('./tiers');
var loopbackTiers = require('./loopback-tiers');

var agentPackage = require('../package.json');

function Agent() {
  events.EventEmitter.call(this);
  this.started = false;
  // Setup default config for apps that just call .use()
  this.configure();
  this.cpuinfo = require('./cpuinfo');
  this.internal = new events.EventEmitter;
  this.internal.send = this.internal.emit.bind(this.internal, 'send');
  this.metrics = new Metrics(this);
}
util.inherits(Agent, events.EventEmitter);

Agent.prototype.profile = function(userKey, appName, options) {
  var self = this;

  if (this.started) {
    this.warn('profiling has already started');
    return;
  }

  if (options == null) {
    options = {};
  }
  options.apiKey = userKey;
  options.appName = appName;

  this.quiet = !!options.quiet;

  this.configure(options);
  var config = this.config;

  if (!config.key || !config.appName) {
    if (!config.key && !config.appName) {
      var errmsg = 'not profiling, StrongOps configuration not found.';
    } else {
      var errmsg = config.key ? 'Application name' : 'API key';
      errmsg += ' not found, StrongOps dashboard reporting disabled.';
    }
    this.notice([
      errmsg,
      'Generate configuration with:',
      '    npm install -g strongloop',
      '    slc strongops',
      'See http://docs.strongloop.com/strong-agent for more information.'
    ].join('\n'));
    return;
  }

  this.notice('dashboard is at https://strongops.strongloop.com');

  var loopbackPath = 'loopback';
  var loopbackVersion = moduleDetector.detectModule(loopbackPath);
  var version = agentPackage.version;

  if (!addon) {
    version += ' (no-addon)';
  }

  this.transport = transport.init({
    agent: config,  // used for key,appName,hostname in handshake
    agentVersion: version,
    port: config.port,  // host/port used only if no endpoint
    host: config.host,
    proxy: config.proxy,
    endpoint: config.endpoint,
    collector: config.collector,  // host/port defaults for http and https
    loopbackVersion: loopbackVersion,
    logger: {
      notice: this.notice.bind(this),
      info: this.info.bind(this),
      warn: this.warn.bind(this),
    }
  });

  // Write internally sent messages on transport, emit transport messages
  // internally.
  //
  // HTTP/JSON transport is agnostic as to form of JSON messages (after the
  // handshake), but the protocol between agent and collector is that message
  // properties are:
  //
  // * cmd {String} command name
  // * args {Array} command arguments
  //
  // Internally, messages received from transport are emitted as events, as:
  //
  //     agent.internal.emit(cmd[, args...])
  //
  // Internally, messages to send to transports (http or metrics) are emitted
  // as:
  //
  //     agent.internal.emit('send', cmd[, args...])

  var self = this;

  this.internal.on('send', function(cmd) {
    var args = [].slice.call(arguments, 1);
    var message = {cmd: cmd, args: args};
    self.transport.send(message);
  });

  this.transport.on('message', function(message) {
    if (message && typeof(message.cmd) === 'string') {
      var args = [message.cmd].concat(message.args);
      self.internal.emit.apply(self.internal, args);
    } else {
      self.warn('unexpected transport command: %j', message);
      // Something went wrong.  Reconnect and start from a clean slate.
      self.transport.disconnect();
      self.transport.connect();
    }
  });
  this.transport.connect();
  this.start();

  return this;
};

Agent.prototype.configure = function(options) {
  options = options || {};
  var apiKey = options.apiKey;
  var appName = options.appName;
  this.config = defaults.configure(apiKey, appName, options, process.env);
  this.addLicense(this.config.license);
};

Agent.prototype.addLicense = function(lic) {
  var license = loadLicense(lic);
  if (license.covers('agent')) {
    // TODO: filter duplicates on license.key
    this.licenses = this.licenses || [];
    this.licenses.push(license);
  }
};

Agent.prototype.licensed = function(feature) {
  var now = new Date();
  return this.licenses && this.licenses.some(function(lic) {
    return lic.covers('agent', feature, now);
  });
};

Agent.prototype.start = function() {
  var config = this.config;

  if (this.started) return;

  if (!addon) {
    this.notice('native addon missing, install a compiler');
  }

  this.notice('v%s profiling app \'%s\' pid \'%d\'', agentPackage.version,
              config.appName, process.pid);

  assert(config.baseInterval, 'config is missing defaults');
  proxy.init(this);
  sender.init(this);
  cpuProf.init(this);
  info.init(this);
  loop.init(this);
  this.dyninst.metrics = dyninstMetrics.init(this, dyninst);

  this.prepareProbes();
  this.prepareProfilers();
  this.prepareClusterControls();
  this.preparePoll(config);

  this.started = true;

  this.info('started profiling agent');
};

Agent.prototype.stop = function() {
  // FIXME(bnoordhuis) This should stop the timer in lib/sender.js.
  if (this.transport) {
    this.transport.disconnect();
  }
  this.started = false;
};

Agent.prototype.prepareProbes = function() {
  var probes = {}, wrapping_probes = {};
  var probe_files = fs.readdirSync(__dirname + '/probes'),
      wrapper_files = fs.readdirSync(__dirname + '/wrapping-probes');

  probe_files.forEach(function(file) {
    var m = file.match(/^(.*)+\.js$/);
    if (m && m.length == 2) probes[m[1]] = true;
  });

  wrapper_files.forEach(function(file) {
    var m = file.match(/^(.*)+\.js$/);
    if (m && m.length == 2) wrapping_probes[m[1]] = true;
  });

  var original_require = module.__proto__.require;
  module.__proto__.require = function(name) {
    var args = Array.prototype.slice.call(arguments),
        target_module = original_require.apply(this, args);

    if (args.length == 1 && target_module && !target_module.__required__) {
      if (wrapping_probes[name]) {
        target_module.__required__ = true;
        target_module = require('./wrapping-probes/' + name)(target_module);
      } else if (probes[name]) {
        target_module.__required__ = true;
        require('./probes/' + name)(target_module);
      }
    }

    return target_module;
  };
};

Agent.prototype.prepareProfilers = function() {
  var self = this;
  memProf.init(this);

  // Allow memory profiling events to be triggered from server
  this.internal.on('memory:start', function() {
    if (memProf.enabled) {
      self.warn('memory profiler has already been started');
      self.internal.send('profile:start', 'memory');
      return;
    }
    if (memProf.start()) {
      self.info('starting memory profiler');
      self.internal.send('profile:start', 'memory');
    } else {
      self.warn('failed to start memory profiler: no compiled addon');
      self.internal.send('profile:unsupported', 'memory');
    }
  });

  self.internal.on('memory:stop', function(/*rowid*/) {
    self.info('stopping memory profiler');
    memProf.stop();
    self.internal.send('profile:stop:v2', 'memory', {});
  });

  // Allow cpu profiling events to be triggered from server
  this.internal.on('cpu:start', function() {
    if (cpuProf.enabled) {
      self.warn('cpu profiler has already been started');
      self.internal.send('profile:start', 'cpu');
      return;
    }
    if (cpuProf.start()) {
      self.info('starting cpu profiler');
      self.internal.send('profile:start', 'cpu');
    } else {
      self.warn('failed to start cpu profiler: no compiled addon');
      self.internal.send('profile:unsupported', 'cpu');
    }
  });

  self.internal.on('cpu:stop', function(rowid) {
    var data = cpuProf.stop();
    if (data) {
      self.info('strong-agent stopping cpu profiler run %d', rowid);
    } else {
      self.info('strong-agent cpu profiler run %d already stopped', rowid);
    }

    // Note that if the data is not received by collector, the profile state
    // will remain at 'started'. The user will become puzzled, and press 'stop'
    // again in the UI, and the next stop will cause use to send null data for
    // the profiler run, but at least we will end in known state of 'stopped'
    self.internal.send('profile:stop:v2', 'cpu', data || {});
  });
};

Agent.prototype.poll = function() {
  var data;

  this.emit('poll::start');

  if (data = counts.poll()) {
    this.internal.emit('counts', data);
  }

  if (data = loop.poll()) {
    this.internal.emit('loop', {loop: data});
  }

  if (data = memProf.poll()) {
    this.internal.emit('instances', {type: 'Instances', state: data});
  }

  if (data = topFunctions.poll()) {
    this.internal.emit('topCalls', data);
  }

  if (data = tiers.poll()) {
    this.internal.emit('tiers', {tiers: data});
  }

  if (data = loopbackTiers.poll()) {
    this.internal.emit('loopback_tiers', {loopback_tiers: data});
  }

  info.poll();  // Returns nothing, recorded as CPU/heap/connection metrics.

  if (data = metrics.poll()) {
    for (var key in data) {
      this.internal.emit('metric', data[key]);
    }
  }

  this.emit('poll::stop');
};

Agent.prototype.preparePoll = function(config) {
  setInterval(this.poll.bind(this), config.baseInterval).unref();
  // Make 'topCalls' events available to strong-supervisor.  This is a
  // semi-internal API; it's intended for SL tooling, not general use.
  this.internal.on('topCalls', this.emit.bind(this, 'topCalls'));
};

// First call will have null control, and clustering configuration will be set
// to {enabled: false}. Later, the strong-cluster-control probe may call this
// with s-c-c as the argument.
Agent.prototype.prepareClusterControls = function(control) {
  var self = this;

  if (self._strongClusterControl) {
    // Ignore multiple initialization
    return;
  }

  var clusterInfo = {enabled: false};

  if (control) {
    var cluster = require('cluster');
    var version = control.VERSION;
    if (version != null && semver.gte(version, '0.2.0')) {
      self._strongClusterControl = control;

      clusterInfo.enabled = !!control._running;
      clusterInfo.isMaster = cluster.isMaster;
      clusterInfo.isWorker = cluster.isWorker;

      if (cluster.isMaster) {
        this.notice('strong-agent using strong-cluster-control v%s', version);

        // Repeating loop is so we don't lose sync on disconnect, should be a
        // better way.
        setInterval(updateClusterStatus, 5000).unref();

        // On any state change which effects status, update it (for faster
        // response on these infrequent events, we don't want to wait 5 seconds
        // to know a worker has died).
        cluster.on('fork', updateClusterStatus);
        cluster.on('exit', updateClusterStatus);
        cluster.on('disconnect', updateClusterStatus);
        control.on('setSize', updateClusterStatus);
        control.on('resize', updateClusterStatus);
        control.on('restart', updateClusterStatus);
        control.on('startRestart', updateClusterStatus);
        control.on('start', updateClusterStatus);
        control.on('stop', updateClusterStatus);

        self.internal.on('cluster:resize', resizeCluster);
        self.internal.on('cluster:restart-all', restartCluster);
        self.internal.on('cluster:terminate', terminateWorker);
        self.internal.on('cluster:shutdown', shutdownWorker);
      }
    } else {
      this.notice('strong-agent cannot use strong-cluster-control %s,',
                  'please update to >= 0.2.0');
    }
  }

  // XXX(sam) It would be possible to display state of a cluster master (workers
  // and change in worker status) even if control wasn't running.
  sendClusterStatus();

  return;

  // XXX(sam) I think all the (!control || !clusterInfo.isMaster) guards below
  // are unnecessary (though harmless).
  function updateClusterStatus() {
    if (!control || !clusterInfo.isMaster) {
      return;
    }
    var status = control.status();
    clusterInfo.setSize = control.options.size;
    clusterInfo.size = status.workers.length;
    clusterInfo.workers = status.workers;
    clusterInfo.restarting = control._restartIds;
    clusterInfo.cpus = control.CPUS;
    clusterInfo.enabled = !!control._running;
    sendClusterStatus();
  }

  function sendClusterStatus() {
    self.internal.send('cluster:status', clusterInfo);
  }

  function resizeCluster(size) {
    if (!control || !clusterInfo.isMaster) return;
    control.setSize(size);
  }

  function restartCluster() {
    if (!control || !clusterInfo.isMaster) return;
    control.restart();
  }

  function shutdownWorker(id) {
    if (!control || !clusterInfo.isMaster) return;
    control.shutdown(id);
  }

  function terminateWorker(id) {
    if (!control || !clusterInfo.isMaster) return;
    control.terminate(id);
  }
};

Agent.prototype.metric = function(scope, name, value, unit, op, persist) {
  if (!this.started) return;
  metrics.add(scope, name, value, unit, op, persist);
};

// Generic debug logging
Agent.prototype.debug = debug;

Agent.prototype.info = function() {
  this.config.logger.info('strong-agent[%d]', process.pid,
                          util.format.apply(util, arguments));
};

Agent.prototype.warn = function() {
  this.config.logger.warn('strong-agent[%d]', process.pid,
                          util.format.apply(util, arguments));
};

// Notice level can be silenced with quiet option to .profile(). supervisor uses
// this to not log the same startup information for every worker. It should be
// used for one-time per application notifications.
Agent.prototype.notice = function() {
  if (!this.quiet) {
    this.config.logger.log('strong-agent', util.format.apply(util, arguments));
  }
};

Agent.prototype.error = function(e) {
  if (e) {
    // Note that `e` is not necessarily an Error, thus the check for .stack
    this.config.logger.error('strong-agent error:', e.stack || e);
  }
};

// Returns `this` on success or undefined on error for parity with .profile().
Agent.prototype.use = function(callback) {
  if (!this.licensed('metrics')) {
    this.notice([
      (this.config.key
           ? 'agent metrics license not found, local reporting disabled.'
           : 'not profiling, agent metrics requires a valid license.'),
      'Please contact sales@strongloop.com for assistance.',
    ].join('\n'));
    return;
  }

  this.start();

  this.internal.on('stats', function(stat, value, type) {
    switch (type) {
      case 'timer':
        return callback(stat + '.timer', value / 1e6 /*ns->ms*/);
      case 'count':
        return callback(stat + '.count', value);
      default:
        return callback(stat, value);
    }
  });

  this.internal.on('counts', function(counts) {
    var labels = {
      strongmq_in: 'messages.in.count',
      strongmq_out: 'messages.out.count',
    };
    for (var key in counts) {
      var label = labels[key] || (key + '.count');
      callback(label, counts[key]);
    }
  });

  this.internal.on('send', function(name, value) {
    if (value == null) return;  // Should never happen.

    if (name === 'update' && value.name === 'CPU util') {
      callback('cpu.total', fix(value.value));
      return;
    }

    if (name === 'update' && value.name === 'CPU util stime') {
      callback('cpu.system', fix(value.value));
      return;
    }

    if (name === 'update' && value.name === 'CPU util utime') {
      callback('cpu.user', fix(value.value));
      return;
    }

    if (name === 'update' && value.name === 'Heap Data') {
      // Convert fractional MBs to bytes.
      callback('heap.used', value.value[0] * 0x100000 | 0);
      callback('heap.total', value.value[1] * 0x100000 | 0);
      return;
    }

    // FIXME(bnoordhuis) Contrary to what the name suggests, this metric is
    // actually a mix of scavenges and full GCs.
    if (name === 'update' && value.name === 'GC Full. V8 heap used') {
      callback('gc.heap.used', value.value * 0x100000 | 0);
      return;
    }

    if (name === 'update' && value.name === 'Connections') {
      // Index 0 is the number of open connections.
      // Index 1 is the new connections/sec rate over the last interval.
      // Index 2 is the number of new connections in the last interval.
      // Index 3 is the number of new connections in the interval before that.
      var curr = value.value[2] | 0;
      var prev = value.value[3] | 0;
      callback('http.connection.count', curr - prev);
      return;
    }

    if (name === 'update' && typeof(value.loop) === 'object') {
      callback('loop.count', value.loop.count | 0);
      callback('loop.minimum', value.loop.fastest_ms | 0);
      callback('loop.maximum', value.loop.slowest_ms | 0);
      callback('loop.average',
               fix(value.loop.sum_ms / (value.loop.count || 1)));
      return;
    }

    if (name === 'update' && typeof(value.tiers) === 'object') {
      debug('tiers:', value.tiers);
      Object.keys(value.tiers)
          .forEach(function(key) {
            // Keys look like 'mongodb_in' or 'redis_out' or just 'http'
            // or 'some.host.fqdn_out' or '12.34.56.78:8080_out'
            var stats = value.tiers[key];
            var last = key.indexOf('_');
            var name = (last < 0 ? key : 'tiers.' + key.slice(0, last));
            callback(name + '.average', fix(stats.mean));
            callback(name + '.maximum', fix(stats.max));
            callback(name + '.minimum', fix(stats.min));
          });
      return;
    }

    if (name === 'instances' && Array.isArray(value.state) === true) {
      value.state.forEach(function(e) {
        callback('object.' + e.type + '.count', e.total | 0);
        callback('object.' + e.type + '.size', e.size | 0);
      });
    }

    if (name === 'topCalls' && typeof(value.update) === 'object') {
      // TODO(bnoordhuis) Turn value.update into something that's palatable
      // to consumers of our API.
      return;
    }
  });

  // Reduce the fraction of a floating point number to a fixed quantity
  // so that e.g. 0.6317000000000004 becomes 0.6317.
  function fix(value) { return +(+value).toFixed(5); }

  return this;
};

Agent.prototype.dyninst = function(stream) {
  var decoder = stream.pipe(json.JsonDecoder());
  decoder.on('data', ondata);
  var encoder = json.JsonEncoder();
  encoder.pipe(stream);
  function ondata(cmd) { dyninst.driver().submit(cmd, onresult); }
  function onresult(err, result) {
    if (err) {
      result = {error: err.message, stack: err.stack};
    }
    if (result) {
      encoder.write(result);
    }
  }
};


function Metrics(agent) {
  this.agent = agent;
  this.stats = customStats.init(agent);
}

// Return an object with an error property on failure, nothing on success.
Metrics.prototype.startCpuProfiling = function(timeout) {
  checkCpuProfSupported(addon);
  if (timeout && !this.agent.licensed('watchdog')) {
    throw Error('Watchdog CPU profiling mode requires license');
  }
  if (timeout)
    this.agent.info('starting cpu profiler (watchdog set to %s ms)', timeout);
  else
    this.agent.info('starting cpu profiler');
  var errmsg = addon.startCpuProfiling(timeout);
  if (errmsg) {
    throw Error(errmsg);
  }
};

// Return an object with an error property on failure, a (probably quite
// large) JSON encoded string on success.
Metrics.prototype.stopCpuProfiling = function() {
  checkCpuProfSupported(addon);
  var profile = addon.stopCpuProfilingAndSerialize();
  if (!profile) {
    throw Error('CPU profiler not started');
  }
  this.agent.info('stopping cpu profiler');
  return profile;
};

Metrics.prototype.startTrackingObjects = function() {
  if (!this.agent.licensed('metrics')) {
    throw Error('Object tracking requires license');
  }
  this.agent.start();
  this.agent.internal.emit('memory:start');
  return addon != null;
};

Metrics.prototype.stopTrackingObjects = function() {
  this.agent.start();
  this.agent.internal.emit('memory:stop');
};

// Expose only to tests
Object.defineProperty(Metrics.prototype, '_checkCpuProfSupported',
{value: checkCpuProfSupported});

// Return errorish object if profiling not supported, null if it is
function checkCpuProfSupported(addon) {
  if (!addon) {
    throw Error("CPU profiler unavailable without compiled add-on");
  }
  if (addon.stopCpuProfilingAndSerialize) {
    return null;
  }
  throw Error("CPU profiler unavailable on Node.js " + process.version);
}


module.exports = new Agent;
module.exports.Agent = Agent;
module.exports.require = require;

Object.defineProperty(global, 'STRONGAGENT', {value: module.exports});
