var counts = null;

exports.sample = function(code) {
  counts = counts || {};
  counts[code] = 1 + (counts[code] | 0);
};

exports.poll = function() {
  var snapshot = counts;
  counts = null;
  return snapshot;
};
