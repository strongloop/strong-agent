var assert = require('assert');
// Store a reference in case the user clobbers the process or Math object.
var hrtime = process.hrtime;
var round = Math.round;

function Timer(scope, command) {
  this.scope = scope;
  this.command = command;
  this._start = undefined;
  this.ms = 0;
}

Timer.prototype.start = function() { this._start = hrtime(); }

Timer.prototype.end = function() {
  var t = hrtime(this._start);
  this.ms = t[0] * 1000 + t[1] / 1e6;
};

module.exports = Timer;
