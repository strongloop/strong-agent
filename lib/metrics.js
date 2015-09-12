'use strict';

var metrics = null;

exports.poll = function() {
  var snapshot = metrics;
  metrics = null;
  return snapshot;
};

exports.add = function(name, value) {
  if (metrics == null) {
    // Users can add their own metrics; we need a prototype-less dictionary
    // to store them or a metric like '__proto__' would cause issues.
    metrics = Object.create(null);
  }
  metrics[name] = value;
};
