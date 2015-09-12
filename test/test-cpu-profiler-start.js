'use strict';

var cpu = require('../lib/profilers/cpu');
cpu.start();

// Stop the profiler before exiting.  It's implemented as a thread that sends
// SIGPROF signals to the main thread.  Node's program epilogue is not equipped
// to deal with such signals and will randomly crash with a SIGILL or SIGSEGV.
setImmediate(cpu.stop);
