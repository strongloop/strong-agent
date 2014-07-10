var Timer = require('./timer');

module.exports = function (tiersName) {
  function BaseTiers () {
    this.stats = {};
    this.config = {};
    this.agent = null;
  }

  // Entry point
  BaseTiers.prototype.init = function (agent_, tiersInterval) {
    this.agent = agent_;
    this.config.tiersInterval = tiersInterval;
    this.start();
  };

  // Put real sampler on contructed object
  BaseTiers.prototype.sample = function (code, time) {
    this.stats[code] = this.stats[code] || [];
    this.stats[code].push(time.ms);
  };

  // Expose this on the Tiers constructor, so we can stub it out
  BaseTiers.prototype.start = function () {
    var self = this;
    Timer.repeat(self.config.tiersInterval, function () {
      if (Object.keys(self.stats).length > 0) {
        var snapshot = {};
        snapshot[tiersName] = {};
        for (var key in self.stats) {
          snapshot[tiersName][key] = {
            mean: arrayMean(self.stats[key])
          };
        }
        self.agent.internal.emit(tiersName, snapshot);
        self.stats = {};
      }
    });
  };

  return new BaseTiers;
};

function arrayMean(ary) {
  if (ary.length > 0) {
    return ary.reduce(function(a, b) {
      return a + b;
    }) / ary.length;
  } else {
    return 0;
  }
}
