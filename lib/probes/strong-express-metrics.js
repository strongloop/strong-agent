'use strict';

var agent = require('../../');
module.exports = function(xstats) {
  xstats.onRecord(function(record) {
    agent.internal.emit('express:usage-record', record);
  });
};
