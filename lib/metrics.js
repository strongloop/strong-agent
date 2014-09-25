var Timer = require('./timer');

var metrics = Object.create(null);

exports.init = function(agent, metricsInterval) {
  Timer.repeat(metricsInterval, function() {
    // XXX(bnoordhuis) Might be more efficient to send all metrics in one go.
    for (var key in metrics) {
      agent.internal.emit('metric', metrics[key]);
    }
    metrics = Object.create(null);
  });
};

exports.add = function(scope, name, value, unit, op, session) {
  if (!scope) scope = 'default-scope';
  var key = scope + ':' + name;
  var obj = metrics[key];
  if (obj) {
    obj.value = value;
    return;
  }
  metrics[key] = {
    name: name,
    op: op,
    scope: scope,
    session: session,
    unit: unit,
    value: value,
  };
};
