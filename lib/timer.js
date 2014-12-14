var assert = require('assert');
// Store a reference in case the user clobbers the process or Math object.
var hrtime = process.hrtime;
var round = Math.round;

function Timer(scope, command) {
  this.scope = scope;
  this.command = command;
  this._begin = undefined;
  this._end = undefined;
  this._elapsed = undefined;
}

Timer.prototype.start = function() { this._begin = this.micro(); };

Timer.prototype.end = function() {
  this._end = this.micro();
  this._elapsed = this._end - this._begin;
  this.ms = this._elapsed / 1000;
  // this is used only in http and express
  this.cputime = 0;
};

Timer.prototype.micro = function() {
  var ht = hrtime();
  return ht[0] * 1e6 + round(ht[1] / 1e3);
};

module.exports = Timer;
