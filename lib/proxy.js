'use strict';

module.exports = {
  after: after,
  around: around,
  before: before,
  callback: callback,
  getter: getter,
  init: init,
};

var kContextPropertyName = '__STRONGOPS_CONTEXT__';

var agent = null;

function before(object, method, hook) { around(object, method, hook); }

function after(object, method, hook) { around(object, method, null, hook); }

function around(object, method, before, after) {
  if (method instanceof Array) {
    method.forEach(function(method) { around(object, method, before, after) });
    return;
  }
  var all = descriptors(object, function(_, des) {
    return des.configurable === true && 'function' === typeof(des.value);
  });
  var des = all[method];
  if (des == null) {
    return;  // No such property.
  }
  var target = des.value;
  if (target == null) {
    return;  // Getter or setter, don't touch.
  }
  if (isproxy(target)) {
    var proxy = target;  // Already patched.
  } else {
    // Reuse a proxy if one already exists, else create a new one.
    var des = first(all, function(_, des) {
      return des && des.value && des.value[kContextPropertyName] &&
             des.value[kContextPropertyName].target === target;
    });
    var proxy = des ? des.value : wrap(target);
  }
  var context = proxy[kContextPropertyName];
  if (before && context.before.indexOf(before) === -1) {
    context.before.push(before);
  }
  if (after && context.after.indexOf(after) === -1) {
    context.after.push(after);
  }
  context.forward = recompile(context);
  each(all, function(method, des) {
    // This check filters out getters and that's intentional: a getter may have
    // observable side effects and its return value need not be constant over
    // time.  It's essentially a black box that can't be inspected.
    if (des && des.value === target) install(object, method, des, proxy);
  });
}

function callback(args, index, before, after) {
  if (index === -1) {
    index = args.length;
    while (--index >= 0 && typeof(args[index]) !== 'function')
      ;
    if (index === -1) return;
  }
  var target = args[index];
  var extra = agent.extra;
  var graph = agent.graph;
  var currentNode = agent.currentNode;
  var proxy = wrap(target, function(recv, args) {
    // TODO(bnoordhuis) Get rid of these globals.
    if (extra) agent.extra = extra;
    if (graph) agent.graph = graph;
    if (currentNode) agent.currentNode = currentNode;
    if (before) before(recv, args, extra, graph, currentNode);
    var rval = target.apply(recv, args);
    if (after) after(recv, args, extra, graph, currentNode);
    // TODO(bnoordhuis) Get rid of these globals.
    if (currentNode) agent.currentNode = undefined;
    if (graph) agent.graph = undefined;
    if (extra) agent.extra = undefined;
    return rval;
  });
  args[index] = proxy;
}

function getter(object, method, hook) {
  if (method instanceof Array) {
    method.forEach(function(method) { getter(object, method, hook) });
    return;
  }
  var des = descriptor(object, method);
  if (des == null) {
    return;
  }
  if (des.get == null) {
    return;  // Not a getter.
  }
  if (des.configurable === false) {
    return;  // Immutable property.
  }
  if (isproxy(des.get)) {
    var proxy = des.get;
  } else {
    var target = des.get;
    var proxy = wrap(target);
    var getters = descriptors(object, function(_, des) {
      return des && des.get && des.get === target && des.configurable === true;
    });
    each(getters, function(method, des) {
      Object.defineProperty(object, method, {
        configurable: true,
        enumerable: des.enumerable,
        get: proxy,
      });
    });
  }
  var context = proxy[kContextPropertyName];
  if (context.after.indexOf(hook) === -1) {
    context.after.push(hook);
  }
  context.forward = recompile(context);
}

function init(agent_) { agent = agent_; }

function each(dict, cb) {
  Object.getOwnPropertyNames(dict)
      .forEach(function(key) { cb(key, dict[key]); });
}

function first(dict, pred) {
  try {
    each(dict, function(key, value) {
      if (pred(key, value)) throw value;
    });
  } catch (value) {
    return value;
  }
}

function descriptors(object, filter) {
  function collect(object, collected) {
    if (object == null || object === Array.prototype ||
        object === Date.prototype || object === Function.prototype ||
        object === Object.prototype) {
      return collected;
    }
    collect(Object.getPrototypeOf(object), collected);
    Object.getOwnPropertyNames(object).forEach(function(key) {
      var des = Object.getOwnPropertyDescriptor(object, key);
      if (filter(key, des)) collected[key] = des;
    });
    return collected;
  }
  return collect(object, Object.create(null));
}

function descriptor(object, method) {
  do {
    var des = Object.getOwnPropertyDescriptor(object, method);
    object = Object.getPrototypeOf(object);
  } while (des == null && object != null);
  return des;
}

function isproxy(fun) {
  return fun && fun.hasOwnProperty(kContextPropertyName);
}

function wrap(target, forward) {
  if (isproxy(target)) {
    return target;
  }
  var context = {
    forward: forward,
    target: target,
    before: [],
    after: [],
  };
  if (context.forward == null) {
    context.forward = recompile(context);
  }
  // Generate a function with the same function name as the target.
  var source = ' (function(context) {                          \n' +
               '   return function ' + target.name + '() {     \n' +
               '     return context.forward(this, arguments);  \n' +
               '   };                                          \n' +
               ' });                                           \n';
  var proxy = eval(source)(context);
  Object.defineProperty(proxy, kContextPropertyName, {value: context});
  // Make stringification yield the source of the target function.
  Object.defineProperty(proxy, 'toString', {
    configurable: true,
    enumerable: false,
    writable: true,
    value: function() { return '' + proxy[kContextPropertyName].target },
  });
  // Copy method annotations from the target (http, shared etc.)
  Object.getOwnPropertyNames(target).forEach(function(k) {
    var des = Object.getOwnPropertyDescriptor(target, k);
    if (des.configurable) {
      Object.defineProperty(proxy, k, des);
    }
  });
  return proxy;
}

function recompile(context) {
  var before = {values: context.before};
  before.argnames = before.values.map(function(_, i) { return 'before' + i });
  before.funcalls = before.values.map(function(f, i) {
    var args = (f.length === 1 ? '(recv)' : '(recv, args)');
    return before.argnames[i] + args;
  });
  var after = {values: context.after};
  after.argnames = after.values.map(function(_, i) { return 'after' + i });
  after.funcalls = after.values.map(function(f, i) {
    var args = (f.length === 2 ? '(recv, rval)' : '(recv, args, rval)');
    return after.argnames[i] + args;
  });
  var source = require('util').format(
      ' (function(%s) {                                   \n' +
          '   return function(recv, args) {                   \n' +
          '     %s;                                           \n' +
          '     var rval = context.target.apply(recv, args);  \n' +
          '     %s;                                           \n' +
          '     return rval;                                  \n' +
          '   };                                              \n' +
          ' })                                                \n',
      ['context'].concat(before.argnames).concat(after.argnames),
      before.funcalls.join(';\n'), after.funcalls.join(';\n'));
  var args = [context].concat(before.values).concat(after.values);
  return eval(source).apply(null, args);
}

function install(object, method, des, proxy) {
  if (des.configurable === false) {
    return;
  }
  var newdes = {
    configurable: true,
    enumerable: des.enumerable,
    writable: des.writable,
    value: proxy,
  };
  Object.defineProperty(object, method, newdes);
}
