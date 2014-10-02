var assert = require('assert');
var debug = require('./debug')('dyninst-metrics');
var util = require('util');

exports.init = function init(agent, dyninst) {
  exports.findScript = findScript;
  exports.patchLine = patchLine;
  exports.patch = patch;

  // name is a regex string long enough to uniquely match a script name.
  //
  // Script names are fully qualified when loaded using node require,
  // and short when builtin to node ('util.js').
  //
  // Return is a debug script object if a unique match was found, null
  // otherwise.
  function findScript(name) { return dyninst.debug().findScript(RegExp(name)); }

  // line is 1-base (first line is line 1), patch is literal code to insert
  // at beginning of line
  function patchLine(name, line, patch) {
    var script = findScript(name);

    if (!script) throw Error('noscript');

    var position = dyninst.debug().findScriptSourcePosition(script, line - 1);

    if (position == null) throw Error('noline');

    debug('patch script %s line %d pos %d: %j', script.name, line, position,
          patch);
    var changes = [position, patch];

    return dyninst.patch(script, changes);
  }

  // patchset looks like:
  //
  //   {
  //     NAME: [ PATCH, ...],
  //     ...
  //   }
  //
  // NAME is a regular expression matching filename to patch
  //
  // PATCH looks like:
  //   {
  //     type: TYPE,
  //     line: LINE,
  //     [metric: METRIC]
  //     [code: CODE,]
  //     [context: CTX,]
  //   }
  //
  // For type:
  // - code: code is literal code to insert
  // - increment, decrement, timer-start, timer-stop:
  //   - metric is dot-separated metric name
  //
  // XXX(sam) I could separate format checking from application of patch, to
  // allow client to report verbose format errors without round-trip through
  // supervisor/agent.
  function patch(patchset) {
    var name;
    var patch;

    try {
      for (name in patchset) {
        var patches = patchset[name];
        patches.forEach(function(_) {
          patch = _;
          debug('patching %s: %j', name, patch);
          assert(patch.type, 'patch for ' + name + ' has no type');
          assert(patch.line, 'patch for ' + name + ' has no line');
          switch (patch.type) {
            case 'code':
              assert(patch.code, 'nocode');
              patchLine(name, patch.line, patch.code);
              break;

            case 'increment':
            case 'decrement':
              patchLine(name, patch.line, incdec(patch.type, patch.metric));
              break;

            case 'timer-start':
              patchLine(name, patch.line,
                        timerStart(patch.metric, patch.context));
              break;

            case 'timer-stop':
              patchLine(name, patch.line, timerStop(patch.context));
              break;

            default:
              throw Error('unsupported patch type: ' + patch.type);
              break;
          }
        });
      }
    } catch (er) {
      patch.file = name;
      debug('patch failed: %s %j', er.message, patch);
      return {error: er.message, patch: patch};
    }
  }

  function checkStatFormat(stat) {
    if (stat == null) {
      throw Error('stat is missing');
    }
    if (typeof stat !== 'string') {
      throw Error('stat is not a string');
    }
    if (!/^\w+(?:\.\w+)*$/.test(stat)) {
      throw Error('stat is not dot-separated words');
    }
    return stat;
  }

  function checkContext(ctx) {
    if (ctx == null) {
      throw Error('context is missing');
    }
    if (typeof ctx !== 'string') {
      throw Error('context is not a string');
    }
    // XXX(sam) not so clear what else we can check, validity as an assignment
    // LHS depends on location of insertion
    return ctx;
  }

  function incdec(call, stat) {
    checkStatFormat(stat);
    return util.format('global.STRONGAGENT.metrics.stats.%s(\'%s\');', call,
                       stat);
  }

  // XXX(sam) try/catch will cause v8 to de-optimize the function, I could
  // also pass all args to global.STRONGAGENT, and let it do the try/catch,
  // or even wrap in an anonymous function. I'm not sure if this is a problem
  // ATM, though.
  function timerStart(stat, ctx) {
    checkContext(ctx);
    return util.format('try{%s.___timer = %s}catch(_){};', ctx,
                       incdec('createTimer', stat));
  }

  function timerStop(ctx) {
    checkContext(ctx);
    return util.format('try{%s.___timer.stop()}catch(_){};', ctx);
  }

  return exports;
};
