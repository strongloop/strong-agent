'use strict';

var licensed;

// addon is exposed so it may be monkey-patched by unit tests
exports.addon = require('../addon');

exports.init = function(agent) {
  licensed = agent.licensed.bind(agent);
};

// A timeout > 0 starts the profiler in watchdog mode.  Watchdog mode pauses
// the profiler until at least |timeout| milliseconds pass without the event
// loop going through epoll_wait(), a reliable indicator that the program is
// stalled on something.  Watchdog mode is currently implemented on i386 and
// x86_64 Linux.
exports.start = function(timeout) {
  if (timeout && !licensed('watchdog')) {
    throw Error('Watchdog CPU profiling mode requires license');
  }
  if (exports.addon == null) {
    return false;
  }
  var errmsg = exports.addon.startCpuProfiling(timeout | 0);
  if (errmsg) {
    throw Error(errmsg);
  }
  exports.enabled = true;
  return true;
};

exports.stop = function() {
  exports.enabled = false;
  return exports.addon && exports.addon.stopCpuProfiling();
};
