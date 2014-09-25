// Copyright (c) 2014, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

'use strict';

module.exports = {
  driver: driver,
  patch: patch,
  position: position,
  unpatch: unpatch,
  debug: debug,
};

// Get access to Debug, an alternative to `node --expose_debug_as=D`/`D.Debug`.
function debug() {
  if (debug.instance == null) {
    // vm.runInDebugContext() is pending joyent/node#8233.
    var runInDebugContext = require('vm').runInDebugContext;
    if (runInDebugContext == null) {
      var addon = require('./addon');
      runInDebugContext = addon && addon.runInDebugContext;
    }
    if (runInDebugContext == null) {
      throw Error('add-on not loaded');
    }
    debug.instance = runInDebugContext('Debug');
  }
  return debug.instance;
}
debug.instance = null;

function patch(f) {
  if (typeof(f) === 'function') {
    return Functions.patch.apply(this, arguments);
  } else {
    return Scripts.patch.apply(this, arguments);
  }
}

function unpatch(f) {
  if (typeof(f) === 'function') {
    return Functions.unpatch.apply(this, arguments);
  } else {
    return Scripts.unpatch.apply(this, arguments);
  }
}

// `script` is a script object, from Debug.scripts().
//
// A script can be found from a name by using debug().findScript(pat), where
// pat is either a function, a regexp applied to the script name, or the
// exact script name.
function position(script, lineno, column) {
  if (lineno < 0) throw Error('Line number < 0');
  if (column < 0) throw Error('Column number < 0');
  lineno -= 1;
  var pos = column;
  var eols = script.line_ends;
  if (lineno >= eols.length) return -1;
  // XXX(bnoordhuis) Do we care if there is a newline between |pos - column|
  // and |pos|?
  if (lineno >= 0) pos += 1 + eols[lineno];
  // |pos <= script.source.length| is not an off-by-one error; we allow
  // insertion at the end of the script.
  return pos <= script.source.length ? pos : -1;
}

function Functions() {}
function Scripts() {}

Functions.patch =
    function(f, config) { return Functions.commit(f, config, Scripts.patch); };

Functions.unpatch = function(f, config) {
  return Functions.commit(f, config, function(script, changes) {
    if (config && config.epilog) {
      // Fix-up: adjust epilog offset.
      if (config.prolog) {
        changes[2] -= config.prolog.length;
        changes[2] -= config.epilog.length;
      } else {
        changes[0] -= config.epilog.length;
      }
    }
    return Scripts.unpatch(script, changes);
  });
};

// Find function f, and patch config.prolog and config.epilog into its body
// prolog goes right after the opening brace, and epilog right before the
// closing brace.
Functions.commit = function(f, config, commit) {
  var script = debug().findScript(f);
  var changes = [];
  var pos = debug().sourcePosition(f);
  if (config && config.prolog) {
    var index = 1 + script.source.indexOf('{', pos);
    changes.push(index, config.prolog);
  }
  if (config && config.epilog) {
    var index = pos + debug().source(f).length - 1;
    changes.push(index, config.epilog);
  }
  return commit(script, changes);
};

// `script` is a script object, changes is an array of character offsets into
// the script source, alternating with the code to be inserted at that offset.
Scripts.patch = function(script, changes) {
  var diff = [];
  var start = 0;
  var offset = 0;
  var chunks = [];
  var source = script.source;
  // We can't use Debug.LiveEdit.SetScriptSource() because it creates the
  // diff using a tokenizer that eats curly braces.  Calculate the diff
  // ourselves, it's a list of (pos1_start, pos1_end, pos2_end) tuples.
  for (var i = 0, n = changes.length; i + 2 <= n; i += 2) {
    var pos = changes[i + 0], change = changes[i + 1];
    offset += change.length;
    diff.push(pos, pos, pos + offset);
    chunks.push(source.slice(start, pos));
    chunks.push(change);
    start = pos;
  }
  chunks.push(source.slice(start));
  return Scripts.commit(script, chunks, diff);
};

Scripts.unpatch = function(script, changes) {
  var diff = [];
  var start = 0;
  var offset = 0;
  var chunks = [];
  var source = script.source;
  var removed = 0;
  for (var i = 0, n = changes.length; i + 2 <= n; i += 2) {
    var pos = changes[i + 0], change = changes[i + 1];
    pos += offset;
    offset += change.length;
    if (start < pos) {
      chunks.push(source.slice(start, pos));
      diff.push(pos, pos + change.length, pos - removed);
    }
    start = pos + change.length;
    removed += change.length;
  }
  chunks.push(source.slice(start));
  return Scripts.commit(script, chunks, diff);
};

Scripts.commit = function(script, chunks, diff) {
  var changelog = [];
  var replacement = chunks.join('');
  var LiveEdit = debug().LiveEdit;
  try {
    var result = LiveEdit.ApplyPatchMultiChunk(script, diff, replacement,
                                               false,  // no preview
                                               changelog);
    return [result, changelog];
  } catch (ex) {
    // Repackage failures, they are not instances of Error.
    if (ex instanceof LiveEdit.Failure) {
      // |details| is available in V8 3.15.8 (i.e. node v0.11) and, if present,
      // contains the syntax error object.
      var details = ex.details;
      ex = Error(ex.message);
      ex.details = details;
    }
    throw ex;
  }
};

function driver() {
  return driver.singleton || (driver.singleton = new Driver);
}
driver.singleton = null;

function Driver() {
  this.patches_ = Object.create(null);
  this.patchids_ = 0;
}

Driver.prototype = {
  patch: Driver$patch,
  scripts: Driver$scripts,
  sources: Driver$sources,
  submit: Driver$submit,
  unpatch: Driver$unpatch,
};

Driver.prototype.commands = Object.create(null);

function Driver$patch(cmd, cont) {
  var scriptid = cmd.scriptid | 0;
  if (scriptid === 0) {
    return fail(cont, 'No scriptid.');
  }
  var script = findscript(scriptid);
  if (script == null) {
    return fail(cont, 'No such script.');
  }
  var changes = cmd.changes;
  if (Array.isArray(changes) === false) {
    return fail(cont, 'No changes.');
  }
  if (changes.length % 2 !== 0) {
    return fail(cont, 'Malformed changes.');
  }
  for (var i = 0, n = changes.length; i < n; i += 2) {
    if (changes[i] !== changes[i] | 0) {
      return fail(cont, 'Malformed changes: position is not a number.');
    }
    if (typeof(changes[i + 1]) !== 'string') {
      return fail(cont, 'Malformed changes: change is not a string.');
    }
  }
  var patch = {id: ++this.patchids_, changes: cmd.changes, script: script};
  var result = Scripts.patch(patch.script, patch.changes);
  if (result[0].change_tree.status !== 'source changed') {
    // Patch didn't apply; explain why.
    return fail(cont, result[0].change_tree.children[0].status_explanation);
  }
  this.patches_[patch.id] = patch;
  defer(cont, null, {
    patchid: patch.id,
    result: result[0],
    changelog: result[1],
  });
}

function Driver$scripts(_, cont) {
  function sort(a, b) { return a.id - b.id }
  function map(s) { return [s.id, s.name || ''] }
  var scripts = debug().scripts().sort(sort).map(map);
  defer(cont, null, flatmap(scripts));
}

function Driver$sources(cmd, cont) {
  if (Array.isArray(cmd.scriptids) === false) {
    return fail(cont, 'No scriptids.');
  }
  var scripts = cmd.scriptids.map(findscript).map(function(script) {
    return script ? [script.source, script.line_ends] : [null, null];
  });
  defer(cont, null, flatmap(scripts));
}

function Driver$submit(cmd, cont) {
  if (cmd.version !== 0) {
    return fail(cont, 'Protocol not supported.');
  }
  if (-1 === ['patch', 'scripts', 'sources', 'unpatch'].indexOf(cmd.cmd)) {
    return fail(cont, 'Bad command: ' + cmd.cmd);
  }
  try {
    this[cmd.cmd](cmd, cont);
  } catch (ex) {
    defer(cont, ex);
  }
}

function Driver$unpatch(cmd, cont) {
  var patch = this.patches_[cmd.patchid | 0];
  if (patch == null) {
    return fail(cont, 'No such patch.');
  }
  // Find newer patches for the same script.
  var patches = [];
  for (var patchid in this.patches_) {
    var that = this.patches_[patchid];
    if (that.id >= patch.id && that.script.id === patch.script.id) {
      patches.push(that);
    }
  }
  // Sort in descending order.
  patches = patches.sort(function(a, b) { return b.id - a.id });
  // And un-appply them in that order.
  patches.forEach(
      function(patch) { Scripts.unpatch(patch.script, patch.changes); });
  // Now apply them again except for the first one,
  // that's the patch we want to drop.
  patches.reverse().slice(1).forEach(
      function(patch) { Scripts.patch(patch.script, patch.changes); });
  delete this.patches_[patch.id];
  defer(cont);
}

function flatmap(lst) { return [].concat.apply([], lst); }

function findscript(id) {
  return debug().scripts().filter(function(s) { return s.id === id })[0];
}

function fail(f, s) { defer(f, Error(s)); }

function defer(f) { process.nextTick(f.bind.apply(f, arguments)); }
