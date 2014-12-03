var Timer = require('./timer');

module.exports = function(tiersName) {
  function BaseTiers() {
    this.stats = null;
    this.config = {};
    this.agent = null;
  }

  // Entry point
  BaseTiers.prototype.init = function(agent_, tiersInterval) {
    this.agent = agent_;
    this.config.tiersInterval = tiersInterval;
    this.start();
  };

  // Put real sampler on contructed object
  BaseTiers.prototype.sample = function(code, time) {
    if (this.stats == null) this.stats = {};
    var ms = time.ms;
    var stat = this.stats[code];
    if (stat == null) {
      this.stats[code] = {count: 1, min: ms, max: ms, sum: ms};
    } else {
      if (ms < stat.min) stat.min = ms;
      if (ms > stat.max) stat.max = ms;
      stat.count += 1;
      stat.sum += ms;
    }
  };

  // Expose this on the Tiers constructor, so we can stub it out
  BaseTiers.prototype.start = function() {
    var self = this;
    Timer.repeat(self.config.tiersInterval, function() {
      if (self.stats == null) return;
      var snapshot = {};
      snapshot[tiersName] = {};
      for (var key in self.stats) {
        var stat = self.stats[key];
        var mean = stat.sum / stat.count;
        snapshot[tiersName][key] = {mean: mean, min: stat.min, max: stat.max};
      }
      self.stats = null;
      self.agent.internal.emit(tiersName, snapshot);
    });
  };

  return new BaseTiers;
};
