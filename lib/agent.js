if ('STRONGAGENT' in global) {
  module.exports = global.STRONGAGENT;
  return;
}

global.nodeflyConfig = require('./config');

var assert  = require('assert');
var fs      = require('fs');
var util    = require('util');
var events  = require('events');
var os      = require('os');
var semver  = require('semver');

var Timer   = require('./timer');
var addon   = require('./addon');
var debug   = require('./debug')(); // DEBUG=strong-agent
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

var package = require('../package.json');

// Constructor cannot take arguments, addon.hide() won't forward them.
var Agent = function() {
  events.EventEmitter.call(this);
  this.mode = Agent.Mode.None;
  this.logger = console;
  this.cpuinfo = require('./cpuinfo');
  this.internal = new events.EventEmitter;
};

if (addon) {
  // Make instances undetectable.
  Agent = addon.hide(Agent);
}

Agent.Mode = {
  None: 'none',
  Emit: 'emit',  // Metrics are processed by application.
  Report: 'report',  // Metrics are reported to collector.
};

util.inherits(Agent, events.EventEmitter);

module.exports = new Agent;
module.exports.Agent = Agent;

Object.defineProperty(global, 'STRONGAGENT', { value: module.exports });

Agent.prototype.profile = function (userKey, appName, options) {
  var self = this;

  if (this.mode === Agent.Mode.Emit) {
    this.error('emitting metrics, will not report to collector!');
    return;
  }

  if (this.mode !== Agent.Mode.None) {
    this.warn('profiling has already started');
    return;
  }

  if (options == null) {
    options = {};
  }

  this.quiet = !!options.quiet;

  var globalConfig = global.nodeflyConfig;
  var config = globalConfig.configure(userKey, appName, options, process.env);

  // Configuration of the logger really belongs in .initialize() but we need
  // it for the call to .notice() below...
  this.logger = config.logger || this.logger;

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

  this.mode = Agent.Mode.Report;
  this.key = config.key;

  if (config.appName instanceof Array) {
    this.appName  = config.appName.shift();
    this.hostname = config.appName.join(':');
  } else {
    this.appName  = config.appName;
    this.hostname = os.hostname();
  }
  this.initialize(config);

  this.notice('v%s profiling app \'%s\' pid \'%d\'',
    package.version, this.appName, process.pid);
  this.notice('dashboard is at https://strongops.strongloop.com');

  if (!addon) {
    this.notice('native addon missing, install a compiler');
  }

  var loopbackPath = 'loopback';
  var loopbackVersion = moduleDetector.detectModule(loopbackPath);
  var version = package.version;

  if (!addon) {
    version += ' (no-addon)';
  }

  this.transport = transport.init({
    agent: this,
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
  this.transport.connect();

  this.prepareProbes();
  this.prepareProfilers();
  this.prepareClusterControls();

  return this;
};

Agent.prototype.initialize = function(config) {
  assert(config.senderInterval, 'config is missing defaults');

  proxy.init();
  sender.init(config.senderInterval);
  counts.init(config.countsInterval);
  info.init();
  metrics.init();
  tiers.init();
  loopbackTiers.init();
  loop.init();

};

Agent.prototype.stop = function() {
  // FIXME(bnoordhuis) This should stop the timer in lib/sender.js.
  this.transport.disconnect();
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
  memProf.init();

  // Allow memory profiling events to be triggered from server
  this.transport.on('memory:start', function () {
    if (memProf.enabled) {
      this.warn('memory profiler has already been started');
      self.transport.send('profile:start', 'memory');
      return;
    }
    if (memProf.start()) {
      self.info('starting memory profiler');
      self.transport.send('profile:start', 'memory');
    } else {
      this.warn('failed to start memory profiler: no compiled addon');
      self.transport.send('profile:unsupported', 'memory');
    }
  });

  self.transport.on('memory:stop', function (rowid) {
    self.info('stopping memory profiler run %d', rowid);
    memProf.stop();
    self.transport.send('profile:stop:v2', 'memory', {});
  });

  // Allow cpu profiling events to be triggered from server
  this.transport.on('cpu:start', function () {
    if (cpuProf.enabled) {
      self.warn('cpu profiler has already been started');
      self.transport.send('profile:start', 'cpu');
      return;
    }
    if (cpuProf.start()) {
      self.info('starting cpu profiler');
      self.transport.send('profile:start', 'cpu');
    } else {
      self.warn('failed to start cpu profiler: no compiled addon');
      self.transport.send('profile:unsupported', 'cpu');
    }
  });

  self.transport.on('cpu:stop', function (rowid) {
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
    self.transport.send('profile:stop:v2', 'cpu', data || {});
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

        self.transport.on('cluster:resize', resizeCluster);
        self.transport.on('cluster:restart-all', restartCluster);
        self.transport.on('cluster:terminate', terminateWorker);
        self.transport.on('cluster:shutdown', shutdownWorker);
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
    self.transport.send('cluster:status', clusterInfo);
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
  if (this.mode === Agent.Mode.None) return;
  metrics.add(scope, name, value, unit, op, persist);
};

// Generic debug logging
Agent.prototype.debug = debug;

Agent.prototype.info = function () {
  this.logger.info(
    'strong-agent[%d]',
    process.pid,
    util.format.apply(util, arguments));
};

Agent.prototype.warn = function () {
  this.logger.warn(
    'strong-agent[%d]',
    process.pid,
    util.format.apply(util, arguments));
};

// Notice level can be silenced with quiet option to .profile(). supervisor uses
// this to not log the same startup information for every worker. It should be
// used for one-time per application notifications.
Agent.prototype.notice = function () {
  if (!this.quiet) {
    this.logger.log('strong-agent', util.format.apply(util, arguments));
  }
};

Agent.prototype.error = function (e) {
  if (e) {
    // Note that `e` is not necessarily an Error, thus the check for .stack
    this.logger.error('strong-agent error:', e.stack || e);
  }
};

function maybeInitializeMetrics(that, config) {
  if (that.mode !== Agent.Mode.None) return;
  config = config || {};
  that.logger = config.logger || that.logger;
  that.mode = Agent.Mode.Emit;
  that.initialize(config);
  that.transport = new events.EventEmitter;  // Fake a transport for now.
  that.transport.send = that.transport.emit.bind(that.transport, 'i::send');
  that.transport.disconnected = function() { return this.connected === false };
  that.transport.disconnect = function() { this.connected = false };
  that.transport.connected = true;
  that.prepareProbes();
  that.prepareProfilers();
  that.info('started metrics reporting');
}

// Returns `this` on success or undefined on error for parity with .profile().
Agent.prototype.use = function(config, callback) {
  if (arguments.length === 1) {
    callback = config;
    config = {};
  }
  config = global.nodeflyConfig.configure(null, null, config, process.env);
  maybeInitializeMetrics(this, config);

  if (this.mode !== Agent.Mode.Emit) {
    this.error('reporting to collector, will not emit metrics!');
    return;
  }

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

  this.transport.on('i::send', function(name, value) {
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
      callback('http.connections', value.value[0] | 0);
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

Agent.prototype.metrics = {
  startCpuProfiling: function() {
    if (addon && addon.stopCpuProfilingAndSerialize) {
      addon.startCpuProfiling();
      return true;
    }
    return false;
  },
  stopCpuProfiling: function() {
    // Return a human-readable error object when the add-on isn't loaded
    // or the profiler hasn't been started.  Chrome won't display it but
    // it gives the application programmer a hint about what went wrong.
    if (addon && addon.stopCpuProfilingAndSerialize) {
      return addon.stopCpuProfilingAndSerialize() ||
             '{"error":"CPU profiler not started."}';
    }
    return '{"error":"CPU profiler unavailable, add-on not loaded."}';
  },
  startTrackingObjects: function() {
    var agent = global.STRONGAGENT;  // FIXME(bnoordhuis) Remove use of global.
    maybeInitializeMetrics(agent);
    agent.transport.emit('memory:start');
    return addon != null;
  },
  stopTrackingObjects: function() {
    var agent = global.STRONGAGENT;  // FIXME(bnoordhuis) Remove use of global.
    maybeInitializeMetrics(agent);
    agent.transport.emit('memory:stop');
  },
};
