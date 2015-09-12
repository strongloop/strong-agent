'use strict';

var addon = require('./addon');

exports.poll = function() {
  if (!addon) {
    return;
  }
  var statistics = addon.eventLoopStatistics;
  var min = statistics[0];
  var max = statistics[1];
  var num = statistics[2];
  var sum = statistics[3];

  statistics[0] = 0;
  statistics[1] = 0;
  statistics[2] = 0;
  statistics[3] = 0;

  if (num === 0) {
    return null;
  }

  // XXX(bnoordhuis) Backwards compatible field names.
  // XXX(bnoordhuis) fastest_ms is new though.
  return {count: num, fastest_ms: min, slowest_ms: max, sum_ms: sum};
};
