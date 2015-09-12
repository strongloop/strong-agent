'use strict';

var oracleCore = require('./oracledb');

module.exports = oracle;

function oracle(oracle) {
  oracleCore.oracleBase(oracle, 'connectSync', 'connect', 'Oracle');
}
