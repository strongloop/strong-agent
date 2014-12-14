var metrics = null;

exports.poll = function() {
  var snapshot = metrics;
  metrics = null;
  return snapshot;
};

exports.add = function(scope, name, value, unit, op, session) {
  if (!scope) scope = 'default-scope';
  var key = scope + ':' + name;
  if (metrics == null) {
    // Users can add their own metrics; we need a prototype-less dictionary
    // to store them or a metric like '__proto__' would cause issues.
    metrics = Object.create(null);
  } else {
    var obj = metrics[key];
    if (obj) {
      obj.value = value;
      return;
    }
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
