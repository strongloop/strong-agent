var Timer = require('./timer');
var events = require('events');
var util = require('util');

var MAX_SIZE = 10;

var TopFunctions = function() {
  if (!(this instanceof TopFunctions)) return new TopFunctions();
  events.EventEmitter.call(this);
  this._resetData();
};

util.inherits(TopFunctions, events.EventEmitter);

TopFunctions.prototype.init = function init(agent, interval) {
  this.agent = agent;
  this.interval = interval;
};

TopFunctions.prototype._ensureStarted = function _ensureStarted() {
  if (this.started)
    return;
  var self = this;
  Timer.repeat(this.interval, function() {
    self.emit('update', self._data);
    process.nextTick(function() { self._resetData(); });
  });
  this.started = true;
};

TopFunctions.prototype._resetData = function _resetData() { this._data = {}; };

TopFunctions.prototype.add =
function add(collectionName, url, wallTime, cpuTime, tiers, graph) {
  this._ensureStarted();
  var now = Date.now();
  var entry = [now, url, wallTime, cpuTime, tiers, graph];

  this._update(collectionName, entry);
};

TopFunctions.prototype._update = function _update(collectionName, data) {
  var update = false;

  var list;
  if (this._data[collectionName]) {
    list = this._data[collectionName].list;
  } else {
    this._data[collectionName] = {
      start: Date.now(),
      collectionName: collectionName,
      list: []
    };
    list = this._data[collectionName].list;
  }

  // on the list
  var found = false;
  list.forEach(function(item) {
    if (item[1] == data[1]) {
      found = true;
      if (item[2] < data[2]) {
        util._extend(item, data);
        update = true;
      }
    }
  });

  // not on list
  if (!found) {
    // list has room
    if (list.length < MAX_SIZE) {
      list.push(data);
      update = true;
    } else {
      // it ranks on list (it's walltime is greater than the last item on the
      // list
      if (data[2] > last(list)[2]) {
        list.pop();
        list.push(data);
        update = true;
      }
    }
  }

  // we changed the content of the window, sort and emit time
  if (update) {
    list.sort(function(a, b) {
      if (a[2] < b[2]) return 1;
      if (a[2] == b[2]) return 0;
      if (a[2] > b[2]) return -1;
    });
  }
};

module.exports = new TopFunctions();

function last(l) {
  if (l.length > 0)
    return l[l.length-1];
  else
    return; // undefined
}
