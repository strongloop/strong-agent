var agent;
var metrics = {};

var Timer   = require('./timer');

exports.init = function(agent_, metricsInterval) {
  agent = agent_;

  Timer.repeat(metricsInterval, function() {
    try {
      release();
    } catch(e) {
      agent.error(e);
    }
  });
};


exports.add = function(scope, name, value, unit, op, session) {

  if (!scope) scope = 'default-scope';

  process.nextTick(function(){
    var key = scope + ':' + name;
    if (!metrics[key]) {
      metrics[key] = {
      scope: scope,
      name: name,
      value: 0,
      _count: 0, // XXX(sam) _count appears unused
      unit: unit,
      op: op,
      session: session
      };
    }

    var obj = metrics[key];
    obj.value = value;
  });
};


var emit = function(obj) {
  try {
    delete obj._count;
    agent.internal.emit('metric', obj);
  } catch(err) {
    agent.error(err);
  }
};

var release = function()
{
  for (var key in metrics) {
    emit(metrics[key]);
  }
  metrics = {};
};
