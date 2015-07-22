var oracleCore = require('./oracle');

module.exports = oracledb;

function oracledb(oracle) {
  oracleCore.oracleBase(oracle, 'getConnection', 'getConnection', 'Oracledb');
}
