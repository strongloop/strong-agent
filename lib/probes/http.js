var util = require('util');
var agent = require('../agent');
var proxy = require('../proxy');
var samples = require('../samples');
var tiers = require('../tiers');
var topFunctions = require('../topFunctions');
var graphHelper = require('../graphHelper');

module.exports = function(http) {
  var config = agent.config;

  // server probe
  proxy.before(http.Server.prototype,
               ['on', 'addListener'],
               function(server, args) {

    // store ref to server so we can pull current connections
    agent.httpServer = server;

    var kContextPropertyName = '__STRONGOPS_HTTP_CONTEXT__';
    var context = server[kContextPropertyName];
    if (context == null) {
      // Index [0] is current connection counter, [1] is the previous one.
      context = { connectionCounts: [0, 0] };
      Object.defineProperty(server, kContextPropertyName, { value: context });
    }

    if (args[0] !== 'request' && args[0] !== 'upgrade')
      return;

    proxy.callback(args, -1, function(obj, args) {
      context.connectionCounts[0] += 1;

      if (agent.paused)
        return;

      var req = args[0];
      var res = args[1];
      var timer = samples.timer("HTTP Server", req.url, true);
      req.tiers = timer.tiers = agent.extra = {};

      var graph = agent.graph = { nodes: [ { name: req.url } ], links: [] };
      req.graph = graph;
      var currentNode = agent.currentNode = 0;

      // TODO(bnoordhuis) This seemingly superfluous interceptor was added in
      // commit ad19c1bc, presumably to keep the transaction chain intact.
      // lib/proxy.js shuffles a number of globals around that make up the
      // transaction chain before and after each intercepted call and this
      // no-op keeps that flow going.  Spooky action at a distance, indeed.
      // Remove it once transaction handling has been rewritten to something
      // sane.
      proxy.before(req, [ 'on', 'addListener' ], function(req, args) {
        proxy.callback(args, -1, function(obj, args) {
          // noop
        });
      });

      proxy.after(res, 'end', function(obj, args) {
        timer.end();

        graph.nodes[0].value = timer.ms;
        topFunctions.add('httpCalls',
                         req.url,
                         timer.ms,
                         timer.cputime,
                         timer.tiers,
                         graph);
        tiers.sample('http', timer);

        timer.tiers.closed = true;
      });
    });
  });

  // client probe
  function getClientResponseHandler(url, host, timer, graphNode) {
    return function handleResponseCb(obj, args, extra) {
      var res = args[0];

      proxy.before(res, [ 'on', 'addListener', 'once'], function(res, args) {
        if (args[0] !== 'end') return;

        proxy.callback(args, -1, function(obj, args, extra) {
          timer.end();
          //if (!time || !timer.done()) return;

          topFunctions.add('externalCalls', url, timer.ms, timer.cputimer);
          graphHelper.updateTimes(graphNode, timer);

          if (extra) {
            extra[host] = extra[host] || 0;
            extra[host] += timer.ms;

            if (extra.closed) {
              if (typeof host === 'string')
                tiers.sample(host + '_out', timer);
            }
            else {
              if (typeof host === 'string')
                tiers.sample(host + '_in', timer);
            }

          }
        }); // res end cb

      }); // res end
    }
  }


  // handle http.request with callback
  proxy.before(http, 'request', function(obj, args) {
    var opts = args[0];
    var cb = args[1];

    if (typeof cb != 'function') return;

    if (opts.headers || opts._headers) {
      // get the url
      var headers = opts._headers || opts.headers;
      var method = opts.method || '';
      var host = headers.Host || headers.host || '';
      var path = opts.path;
      var url = util.format('%s http://%s%s', method, host, path);

      // TODO(bnoordhuis) Filter out agent HTTP proxy requests.
      if (host === config.collector.http.host ||
          host === config.collector.https.host) {
        return;
      }

      var timer = samples.timer("HTTP Client", url, true);
      var graphNode = graphHelper.startNode('Outgoing HTTP', url, agent);

      proxy.callback(args, -1, getClientResponseHandler(url, host, timer, graphNode));
      if (graphNode) agent.currentNode = graphNode.prevNode;
    }
  });



  // handle ClientRequest, evented.
  if (http.ClientRequest && http.ClientRequest.prototype) {

    proxy.before(http.ClientRequest.prototype, ['on', 'addListener', 'once'], function onResponse(req, args){
      if (args[0] !== 'response')
        return;

      if (req._headers || req.headers) {
        var headers = req._headers || req.headers;
        var method = req.method || '';
        var host = headers.Host || headers.host || '';
        var path = req.path;
        var url = util.format('%s http://%s%s', method, host, path);

        // don't track the agent calling home
        // XXX(sam) see comments above
        if (host === config.collector.http.host ||
            host === config.collector.https.host) {
          return;
        }

        var timer = samples.timer("HTTP Server", url, true);
        var graphNode = graphHelper.startNode('Outgoing HTTP', url, agent);

        proxy.callback(args, -1, getClientResponseHandler(url, host, timer, graphNode));
        if (graphNode) agent.currentNode = graphNode.prevNode;
      }

    }); // before on/add/once

  } // http.ClientRequest


};
