var debug = require('../debug')('profilers:memory');

function Instances() {
  this.addon = require('../addon');
  this.agent = null;
  this.enabled = false;
}
module.exports = new Instances;

Instances.prototype.init = function(agent_) {
  this.agent = agent_;
};

Instances.prototype.start = function() {
  if (!this.addon) {
    this.agent.info('could not start heap monitoring add-on');
    return false;
  }
  debug('instance monitoring started');
  this.addon.startHeapDiff();
  this.enabled = true;
  return true;
};

Instances.prototype.stop = function() {
  if (!this.enabled) return;
  debug('instance monitoring stopped');
  this.addon.stopHeapDiff(false);
  this.enabled = false;
};

Instances.prototype.poll = function() {
  if (!this.enabled) return null;
  var state = this.addon.stopHeapDiff(true);
  this.addon.startHeapDiff();
  return state;
};
