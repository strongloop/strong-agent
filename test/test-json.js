'use strict';

var assert = require('assert');
var stream = require('stream');
var util = require('util');

var JsonDecoder = require('../lib/json').JsonDecoder;
var JsonEncoder = require('../lib/json').JsonEncoder;

function Bucket(options) {
  this.constructor.call(this, options);
  this.chunks = [];
  this.encodings = [];
  this._write = function(chunk, encoding, next) {
    this.encodings.push(encoding);
    this.chunks.push(chunk);
    next();
  };
}
Bucket.prototype = Object.create(stream.Writable.prototype);

var tests = [

  function(next) {
    assert(JsonDecoder() instanceof JsonDecoder);
    assert(JsonEncoder() instanceof JsonEncoder);
    next();
  },

  function(next) {
    var decoder = new JsonDecoder;
    var events = [];
    decoder.on('data', function(data) {
      events.push(data);
      this.pause();
      setTimeout(this.resume.bind(this));
    });
    decoder.on('end', function() {
      assert.deepEqual(events, []);
      next();
    });
    decoder.end('\n\n\n');
  },

  function(next) {
    var decoder = new JsonDecoder;
    var events = [];
    decoder.on('data', function(data) {
      events.push(data);
      this.pause();
      setTimeout(this.resume.bind(this));
    });
    decoder.on('end', function() {
      assert.deepEqual(events, [{aaaa: 1}, {b: 2}, {c: 3}]);
      next();
    });
    var json = '{"aaaa":1}\n{"b":2}\n{"c":3}\n';
    json.split('').forEach(function(ch) { decoder.write(ch); });
    decoder.end();
  },

  function(next) {
    var decoder = new JsonDecoder;
    var events = [];
    decoder.on('data', function(data) {
      events.push(data);
      this.pause();
      setTimeout(this.resume.bind(this));
    });
    decoder.on('end', function() {
      assert.deepEqual(events, [{aaaa: 1}, {b: 2}, {c: 3}]);
      next();
    });
    decoder.write('{"aaaa":1}');
    decoder.end('\n' +
                '{"b":2}\n' +
                '{"c":3}\n');
  },

  function(next) {
    var decoder = new JsonDecoder;
    var events = [];
    decoder.on('data', function(data) {
      events.push(data);
      this.pause();
      setTimeout(this.resume.bind(this));
    });
    decoder.on('end', function() {
      assert.deepEqual(events, [{a: 1}, {b: 2}, {c: 3}]);
      next();
    });
    decoder.write('{"a":1}\n');
    decoder.write('{"b":2}\n');
    decoder.end('{"c":3}\n');
  },

  function(next) {
    var bucket = new Bucket({objectMode: true});
    var decoder = new JsonDecoder;
    decoder.pipe(bucket);
    decoder.write('{"a":1}\n');
    decoder.write('{"b":2}\n');
    decoder.end('{"c":3}\n');
    setImmediate(function() {
      assert.deepEqual(bucket.encodings, ['utf8', 'utf8', 'utf8']);
      assert.deepEqual(bucket.chunks, [{a: 1}, {b: 2}, {c: 3}]);
      next();
    });
  },

  function(next) {
    var encoder = new JsonEncoder;
    var events = [];
    encoder.on('data', function(data) {
      events.push(data);
      this.pause();
      setTimeout(this.resume.bind(this));
    });
    encoder.on('end', function() {
      assert.deepEqual(events, ['{"a":1}\n', '{"b":2}\n', '{"c":3}\n']);
      next();
    });
    encoder.write({a: 1});
    encoder.write({b: 2});
    encoder.end({c: 3});
  },

  function(next) {
    var bucket = new Bucket({decodeStrings: false});
    var encoder = new JsonEncoder;
    encoder.pipe(bucket);
    encoder.write({a: 1});
    encoder.write({b: 2});
    encoder.write({c: 3});
    setImmediate(function() {
      assert.deepEqual(bucket.encodings, ['utf8', 'utf8', 'utf8']);
      assert.deepEqual(bucket.chunks, ['{"a":1}\n', '{"b":2}\n', '{"c":3}\n']);
      next();
    });
  },

  function(next) {
    var decoder = new JsonDecoder;
    var encoder = new JsonEncoder;
    var events = [];
    decoder.on('end', function() {
      assert.deepEqual(events, [{a: 1}, {b: 2}, {c: 3}]);
      next();
    });
    encoder.pipe(decoder).on('data', function(data) {
      events.push(data);
      this.pause();
      setTimeout(this.resume.bind(this));
    });
    encoder.write({a: 1});
    encoder.write({b: 2});
    encoder.end({c: 3});
  },

  function(next) {
    var decoder = new JsonDecoder;
    var data = 'x\n';
    decoder.on('error', function(err) {
      assert(err instanceof SyntaxError);
      assert.equal(err.data, data);
      next();
    });
    decoder.write(data);
  },

  function(next) {
    var decoder = new JsonDecoder(2);
    decoder.on('data', function(data) {
      assert.deepEqual(data, {x: 42});
      next();
    });
    decoder.write('{');
    decoder.write('"x":42}\n');
  },

  function(next) {
    var decoder = new JsonDecoder(42);
    decoder.on('error', function(err) {
      assert(/Buffer size .* exceeds threshold/.test(err.message));
      decoder = null;
      next();
    });
    function write() {
      if (decoder) {
        decoder.write('x');
        setImmediate(write);
      }
    }
    write();
  },

];

// XXX(bnoordhuis) Maybe change it to print the name of the hanging test?
var idle = setInterval(console.log.bind(null, 'tick'), 1e3);

tests.slice().reverse().reduce(function(next, test) {
  return test.bind(null, next || clearInterval.bind(null, idle));
}, null)();
