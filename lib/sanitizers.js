exports.metrics = metrics;

function metrics(rough) {
  var metrics = {};

  if ('scope' in rough) metrics.scope = rough.scope;
  if ('name' in rough) metrics.name = rough.name;
  if ('value' in rough) metrics.value = rough.value;

  if ('callCounts' in rough) {
    Object.keys(rough.callCounts).forEach(function(key) {
      metrics.callCounts = metrics.callCounts || {};
      metrics.callCounts[key] = { count: rough.callCounts[key].count };
    });
  }

  if ('tiers' in rough) {
    metrics.tiers = sanitizeTiers(rough.tiers);
  }
  if ('loopback_tiers' in rough) {
    metrics.loopback_tiers = sanitizeTiers(rough.loopback_tiers);
  }

  return Object.keys(metrics).length > 0 ? metrics : null;
}

function sanitizeTiers(rough) {
  var clean = {};
  for (tier in rough) {
    clean[tier] = { mean: rough[tier].avg || rough[tier].mean || 0 };
  }
  return clean;
}
