'use strict';

var agent = require('../');
var tap = require('tap');

function transactionLink(linkName, callback) {
  var proxy = function(){callback(); return linkName;};
  return proxy;
}

var optionsWithNullTracer = {
  strongTracer: null
};

var optionsWithStubTracer = {
  strongTracer: {tracer: {transactionLink: transactionLink}}
};

tap.test('transactionLink does not wrap when not licensed', function(t) {
  var myLinkName = 'my_link_name';
  agent.configure(optionsWithNullTracer);
  var isCalled = false;
  var myCallback = function(){isCalled = true; return "my result"};
  var proxy = agent.transactionLink(myLinkName, myCallback);
  var result = proxy();
  t.ok(isCalled, 'my callback is called');
  t.equal(proxy, myCallback, 'transactionLink returned my callback');
  t.equal(result, myCallback(), 'transactionLink returned my result');
  t.end();
});

tap.test('transactionLink wraps when licensed', function(t) {
  var myLinkName = 'my_link_name';
  agent.configure(optionsWithStubTracer);
  var isCalled = false;
  var myCallback = function(){isCalled = true; return null};
  var proxy = agent.transactionLink(myLinkName, myCallback);
  var result = proxy();
  t.ok(isCalled, 'my callback is called');
  t.notEqual(proxy, myCallback, 'transactionLink returned proxy');
  t.equal(result, myLinkName, 'proxy returned processed result');
  t.end();
});

tap.test('strongTraceLink wraps function in args when callback exists', function(t) {
  var myLinkName = 'my_link_name';
  agent.configure(optionsWithStubTracer);
  var isCalled = false;
  var dbId = "DatabaseId";
  var query = "query strong";
  var myCallback = function(){isCalled = true; return myLinkName};
  var args = [myCallback];
  agent.strongTraceLink(dbId, query, args);
  var result = args[0]();
  t.ok(isCalled, 'my callback is called');
  t.notEqual(args[0], myCallback, 'strongTraceLink replaced my callback with proxy');
  t.equal(result, dbId + " " + query, 'proxy returned proxy result');
  t.end();
});

tap.test('strongTraceLink appends function to args when no callbacks exist', function(t) {
  var myLinkName = 'my_link_name';
  agent.configure(optionsWithStubTracer);
  var dbId = "DatabaseId";
  var query = "query strong";
  var args = (function() { return arguments; })()
  agent.strongTraceLink(dbId, query, args);
  t.ok(args.length===1, 'args is appended');
  t.equal(typeof args[0], 'function', 'function is appended');
  var result = args[0]();
  t.equal(result, dbId + " " + query, 'proxy returned proxy result');
  t.end();
});
