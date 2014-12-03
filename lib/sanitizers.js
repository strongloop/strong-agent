exports.metrics = metrics;

function metrics(rough) {
  var metrics = {};
  if ('scope' in rough) metrics.scope = rough.scope;
  if ('name' in rough) metrics.name = rough.name;
  if ('value' in rough) metrics.value = rough.value;
  return Object.keys(metrics).length > 0 ? metrics : null;
}
