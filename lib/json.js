// Copyright (c) 2014, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

var stream = require('stream');
var util = require('util');

exports.JsonDecoder = JsonDecoder;
exports.JsonEncoder = JsonEncoder;

// |maxlen| is the amount of unparsed JSON data that may be buffered.
// |maxlen| < 1 means 'unlimited'
//
// When the |maxlen| threshold is exceeded, an 'error' event is emitted on
// the decoder object and the decoder stops parsing.  The decoder can then
// be resumed by feeding it more data.
function JsonDecoder(maxlen) {
  if (!(this instanceof JsonDecoder)) return new JsonDecoder(maxlen);
  this.constructor.call(this, {objectMode: true});
  this.buffer_ = '';
  this.index_ = 0;
  this.maxlen_ = (maxlen | 0) || -1;
  this.slice_ = null;
}

JsonDecoder.prototype = Object.create(stream.Transform.prototype);

JsonDecoder.prototype._transform = function(chunk, encoding, done) {
  this.buffer_ += chunk.toString();
  for (;;) {
    this.slice_ = null;
    var index = this.buffer_.indexOf('\n', this.index_);
    if (index === -1) {
      this.index_ = this.buffer_.length;
      // Do the check now rather than before entering the loop.  If the new
      // chunk causes the threshold to be exceeded but contains the newline
      // that we're looking for, then we might as well parse the JSON.  But
      // if there is still no newline, report a 'threshold exceeded' error.
      if (this.maxlen_ > 0 && this.buffer_.length > this.maxlen_) {
        var err = Error(util.format('Buffer size %d exceeds threshold.',
                                    this.buffer_.length));
        this.emit('error', err);
        return done();
      }
      break;
    }
    var length = index + 1;
    this.slice_ = this.buffer_.slice(0, length);
    this.buffer_ = this.buffer_.slice(length);
    this.index_ -= index;
    if (length === 1) {  // A single newline is not a JSON object.
      continue;
    }
    try {
      var object = JSON.parse(this.slice_);
      this.slice_ = null;
    } catch (ex) {
      var err = ex;
      // Make the property non-enumerable so that printing the error object
      // won't also print possibly megabytes of JSON data.
      Object.defineProperty(err, 'data', {value: this.slice_});
    }
    if (err) {
      this.emit('error', err);
      err = null;
    } else {
      this.push(object);
    }
    if (this.paused) {
      break;
    }
  }
  done();
};

function JsonEncoder() {
  if (!(this instanceof JsonEncoder)) return new JsonEncoder;
  this.constructor.call(this, {objectMode: true});
}

JsonEncoder.prototype = Object.create(stream.Transform.prototype);

JsonEncoder.prototype._transform = function(chunk, encoding, done) {
  this.push(JSON.stringify(chunk) + '\n', 'utf8');
  done();
};
