module.exports = function() {
  function BaseTiers() {
    this.stats = null;
  }

  BaseTiers.prototype.sample = function(code, time) {
    var ms = time.ms;
    var stat = null;
    if (this.stats) {
      stat = this.stats[code];
    } else {
      this.stats = {};
    }
    if (stat == null) {
      this.stats[code] = {num: 1, mean: ms, min: ms, max: ms, sum: ms};
    } else {
      if (ms < stat.min) stat.min = ms;
      if (ms > stat.max) stat.max = ms;
      stat.num += 1;
      stat.sum += ms;
      stat.mean = stat.sum / stat.num;
    }
  };

  BaseTiers.prototype.poll = function() {
    var snapshot = this.stats;
    this.stats = null;
    return snapshot;
  };

  return new BaseTiers;
};
