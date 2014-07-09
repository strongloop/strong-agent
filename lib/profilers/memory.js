var Timer = require('../timer');
var config = require('../config');
var debug = require('../debug')('profilers:memory');

function Instances() {
  this.addon = require('../addon');
  this.agent = null;
  this.enabled = false;
  this.instances = [];
  this.timer = null;

  // NOTE: Can not be prototype function. Difficult to bind and use with off()
  var self = this;
  this._step = function () {
    debug('instance monitoring step');
    var state = self.addon.stopHeapDiff(true);
    self.agent.internal.emit('instances', { type: 'Instances', state: state });
    self.addon.startHeapDiff();
  };
}
module.exports = new Instances;

Instances.prototype.init = function(agent_) {
  this.agent = agent_;
};

Instances.prototype.start = function () {
  if (!this.addon) {
    this.agent.info('could not start heap monitoring add-on');
    return false;
  }
  debug('instance monitoring started');
  this.instances = [];
  this.addon.startHeapDiff();
  this.timer = Timer.repeat(config.heapDiffInterval, this._step);
  this._step();
  this.enabled = true;
  return true;
};

Instances.prototype.stop = function () {
  if (!this.addon) return;
  debug('instance monitoring stopped');
  if (this.timer) {
    this.addon.stopHeapDiff(false);
    clearInterval(this.timer);
    this.timer = null;
  }
  this.enabled = false;
};
