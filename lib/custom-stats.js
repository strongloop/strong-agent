exports.init = function init(agent) {
  function report(stat, value, type) {
    agent.internal.emit('stats', 'custom.' + stat, value, type);
  }

  var counters = Object.create(null);

  function count(stat, change) {
    var latest = counters[stat] = (counters[stat] | 0) + change;
    report(stat, latest, 'count');
  }

  exports.increment = function increment(stat) { count(stat, +1); };

  exports.decrement = function decrement(stat) { count(stat, -1); };

  function StatTimer(stat) {
    this._stat = stat;
    this._start = process.hrtime();
  };

  StatTimer.prototype.stop = function stop() {
    if (!this._start) return;  // Timer stopped multiple times!

    // Use full resolution ns internally, it will be converted to ms if reported
    // to statsd.
    var diff = process.hrtime(this._start);
    var delta = diff[0] * 1e9 + diff[1];

    this._start = undefined;

    report(this._stat, delta, 'timer');
  };

  exports.createTimer =
      function createTimer(stat) { return new StatTimer(stat); };

  return exports;
}
