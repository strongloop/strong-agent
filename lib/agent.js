if ('STRONGAGENT' in global) {
  module.exports = global.STRONGAGENT;
  return;
}

var assert  = require('assert');
var fs      = require('fs');
var util    = require('util');
var events  = require('events');
var semver  = require('semver');

var Timer   = require('./timer');
var addon   = require('./addon');
var debug   = require('./debug')(); // DEBUG=strong-agent
var defaults = require('./config');
var proxy   = require('./proxy');
var sender  = require('./sender');
var counts  = require('./counts');
var info    = require('./info');
var metrics = require('./metrics');
var transport = require('./transport');
var loop    = require('./loop');
var moduleDetector = require('./module-detector');

// Profilers
var cpuProf = require('./profilers/cpu');
var memProf = require('./profilers/memory');

var tiers = require('./tiers');
var loopbackTiers = require('./loopbackTiers');

var agentPackage = require('../package.json');

// Constructor cannot take arguments, addon.hide() won't forward them.
var Agent = function() {
  events.EventEmitter.call(this);
  this.started = false;
  // Setup default config for apps that just call .use()
  this.config = defaults.configure(null, null, {}, process.env);
  this.cpuinfo = require('./cpuinfo');
  this.internal = new events.EventEmitter;
  this.internal.send = this.internal.emit.bind(this.internal, 'i::send');
};

if (addon) {
  // Make instances undetectable.
  Agent = addon.hide(Agent);
}

util.inherits(Agent, events.EventEmitter);

module.exports = new Agent;
module.exports.Agent = Agent;

Object.defineProperty(global, 'STRONGAGENT', { value: module.exports });

Agent.prototype.profile = function (userKey, appName, options) {
  var self = this;

  if (this.started) {
    this.warn('profiling has already started');
    return;
  }

  if (options == null) {
    options = {};
  }

  this.quiet = !!options.quiet;

  this.config = defaults.configure(userKey, appName, options, process.env);
  var config = this.config;

  if (!config.key || !config.appName) {
    this.notice([
      'not profiling, configuration not found.',
      'Generate configuration with:',
      '    npm install -g strong-cli',
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
    agent: config, // used for key,appName,hostname in handshake
    agentVersion: version,
    port: config.port, // host/port used only if no endpoint
    host: config.host,
    proxy: config.proxy,
    endpoint: config.endpoint,
    collector: config.collector, // host/port defaults for http and https
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
  //     agent.internal.emit('i::send', cmd[, args...])

  var self = this;

  this.internal.on('i::send', function(cmd) {
    var args = [].slice.call(arguments, 1);
    var message = { cmd: cmd, args: args };
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

Agent.prototype.start = function() {
  var config = this.config;

  if (this.started) return;

  if (!addon) {
    this.notice('native addon missing, install a compiler');
  }

  if (!config.key) {
    this.notice([
      'not profiling, configuration not found.',
      'Generate configuration with:',
      '    npm install -g strong-cli',
      '    slc strongops',
      'See http://docs.strongloop.com/strong-agent for more information.'
    ].join('\n'));
    return;
  }

  this.notice('v%s profiling app \'%s\' pid \'%d\'',
              agentPackage.version, config.appName, process.pid);

  assert(config.senderInterval, 'config is missing defaults');
  proxy.init(this);
  sender.init(this, config.senderInterval);
  counts.init(this, config.countsInterval);
  info.init(this, config.collectInterval);
  metrics.init(this, config.metricsInterval);
  tiers.init(this, config.tiersInterval);
  loopbackTiers.init(this, config.tiersInterval);
  loop.init(this, config.loopInterval);

  this.prepareProbes();
  this.prepareProfilers();
  this.prepareClusterControls();

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

Agent.prototype.prepareProbes = function () {
  var probes = {},
    wrapping_probes = {};
  var probe_files = fs.readdirSync(__dirname + '/probes'),
    wrapper_files = fs.readdirSync(__dirname + '/wrapping_probes');

  probe_files.forEach(function (file) {
    var m = file.match(/^(.*)+\.js$/);
    if (m && m.length == 2) probes[m[1]] = true;
  });

  wrapper_files.forEach(function (file) {
    var m = file.match(/^(.*)+\.js$/);
    if (m && m.length == 2) wrapping_probes[m[1]] = true;
  })

  // Monkey-wat?
  var original_require = module.__proto__.require;
  module.__proto__.require = function(name) {
    var args = Array.prototype.slice.call(arguments),
      target_module = original_require.apply(this, args);

    if (args.length == 1 && target_module && !target_module.__required__) {
      if (wrapping_probes[name]) {
        target_module.__required__ = true;
        target_module = require('./wrapping_probes/' + name)(target_module);
      } else if (probes[name]) {
        target_module.__required__ = true;
        require('./probes/' + name)(target_module);
      }
    }

    return target_module;
  }
};

Agent.prototype.prepareProfilers = function () {
  var self = this;
  memProf.init(this);

  // Allow memory profiling events to be triggered from server
  this.internal.on('memory:start', function () {
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

  self.internal.on('memory:stop', function (rowid) {
    self.info('stopping memory profiler run %d', rowid);
    memProf.stop();
    self.internal.send('profile:stop:v2', 'memory', {});
  });

  // Allow cpu profiling events to be triggered from server
  this.internal.on('cpu:start', function () {
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

  self.internal.on('cpu:stop', function (rowid) {
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

// First call will have null control, and clustering configuration will be set
// to {enabled: false}. Later, the strong-cluster-control probe may call this
// with s-c-c as the argument.
Agent.prototype.prepareClusterControls = function (control) {
  var self = this;

  if (self._strongClusterControl) {
    // Ignore multiple initialization
    return;
  }

  var clusterInfo = {
    enabled: false
  };

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
        Timer.repeat(5000, updateClusterStatus);

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
    }
    else {
      this.notice(
        'strong-agent cannot use strong-cluster-control %s,',
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

Agent.prototype.metric = function (scope, name, value, unit, op, persist) {
  if (!this.started) return;
  metrics.add(scope, name, value, unit, op, persist);
};

// Generic debug logging
Agent.prototype.debug = debug;

Agent.prototype.info = function () {
  this.config.logger.info(
    'strong-agent[%d]',
    process.pid,
    util.format.apply(util, arguments));
};

Agent.prototype.warn = function () {
  this.config.logger.warn(
    'strong-agent[%d]',
    process.pid,
    util.format.apply(util, arguments));
};

// Notice level can be silenced with quiet option to .profile(). supervisor uses
// this to not log the same startup information for every worker. It should be
// used for one-time per application notifications.
Agent.prototype.notice = function () {
  if (!this.quiet) {
    this.config.logger.log('strong-agent', util.format.apply(util, arguments));
  }
};

Agent.prototype.error = function (e) {
  if (e) {
    // Note that `e` is not necessarily an Error, thus the check for .stack
    this.config.logger.error('strong-agent error:', e.stack || e);
  }
};

// Returns `this` on success or undefined on error for parity with .profile().
Agent.prototype.use = function(callback) {
  this.start();

  this.internal.on('callCounts', function(obj) {
    var labels = {
      strongmq_in: 'messages.in.count',
      strongmq_out: 'messages.out.count',
    };
    Object.keys(obj.callCounts).forEach(function(key) {
      var label = labels[key] || (key + '.count');
      var stats = obj.callCounts[key];
      callback(label, stats.count | 0);
    });
  });

  this.internal.on('i::send', function(name, value) {
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
      Object.keys(value.tiers).forEach(function(key) {
        // FIXME(bnoordhuis) Proper label.  Also, we probably want to collect
        // more than just the mean average.
        var label = 'tiers.' + key + '.average';
        var mean = value.tiers[key].mean;
        callback(label, fix(mean));
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
  function fix(value) {
    return +(+value).toFixed(5);
  }

  return this;
};

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

Agent.prototype.metrics = {
  // Return an object with an error property on failure, nothing on success.
  startCpuProfiling: function() {
    checkCpuProfSupported(addon);
    addon.startCpuProfiling();
  },
  // Return an object with an error property on failure, a (probably quite
  // large) JSON encoded string on success.
  stopCpuProfiling: function() {
    checkCpuProfSupported(addon);
    var profile = addon.stopCpuProfilingAndSerialize();
    if (!profile) {
      throw Error('CPU profiler not started');
    }
    return profile;
  },
  startTrackingObjects: function() {
    var agent = module.exports;
    agent.start();
    agent.internal.emit('memory:start');
    return addon != null;
  },
  stopTrackingObjects: function() {
    var agent = module.exports;
    agent.start();
    agent.internal.emit('memory:stop');
  },
};

// Expose only to tests
Object.defineProperty(Agent.prototype.metrics, '_checkCpuProfSupported', {
  value: checkCpuProfSupported
});
