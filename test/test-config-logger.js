var assert = require('assert');
var util = require('util');
var _ = require('underscore');

var logged = [];
var log = function() {
  var msg = util.format.apply(util, arguments);
  logged.push(msg);
};
var logger = {
  log: log,
  info: log,
  warn: log,
  error: log,
};

var agent = require('../').profile('key', 'app', {logger: logger});

// The four log APIs supported by agent
var levels = ['info', 'warn', 'notice', 'error'];

levels.forEach(function(level) {
  agent[level].apply(agent, ['level is ' + level]);
});

process.on('exit', function() {
  // We should have seen each of our messages
  var seen = _.chain(logged).map(function(line) {
    var match = line.match('level is (.+)');
    if (match) {
      return match[1];
    }
  }).compact().value();
  assert.deepEqual(seen, levels);
});
