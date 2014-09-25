function hello() {
  return 'hello';
}

function bye() {
  return 'bye';
}

function Runner(name) {
  this.name = name;
}

require('util').inherits(Runner, require('events').EventEmitter);

Runner.prototype.start = function() {
  var self = this;
  self.start = process.hrtime();
  setTimeout(function() {
    var diff = process.hrtime(self.start); // calculate diff, as control value
    self.diff = (diff[0] * 1e3 + diff[1] / 1e6); // [sec,ns], as ms
    self.emit('done');
  }, self.interval);
  return self;
}

Runner.setInterval = function(interval) { // ms
  Runner.prototype.interval = Runner.interval = interval;
}

Runner.setInterval(10);

exports.bye = bye;
exports.hello = hello;
exports.Runner = Runner;
