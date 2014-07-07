var assert = require('assert');
// Store a reference in case the user clobbers the process or Math object.
var hrtime = process.hrtime;
var round = Math.round;

var Timer = function(scope, command)
{
  this.scope = scope;
  this.command = command;

  this._begin   = undefined;
  this._end     = undefined;
  this._elapsed = undefined;
}

Timer.prototype.start = function()
{
  this._begin = this.micro();
}

Timer.prototype.end = function()
{
  this._end = this.micro();
  this._elapsed = this._end - this._begin;
  this.ms = this._elapsed / 1000;
  // this is used only in http and express
  this.cputime = 0;
}

Timer.prototype.micro = function()
{
  var ht = hrtime();
  return ht[0] * 1e6 + round(ht[1] / 1e3);
}

Timer.repeat = function(interval, callback)
{
  assert.notEqual(interval, null, 'agent attempting to busy-loop');

  // Force interval to be an integer to avoid joyent/node#7391
  var t = setInterval(callback, 0 | interval);

  // Unref the timer so it won't keep the event loop alive.
  // The feature check is for v0.8 compatibility.
  if (t.unref) {
    t.unref();
  }

  return t;
}

module.exports = Timer;
