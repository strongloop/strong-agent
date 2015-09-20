'use strict';

global.Promise = require('bluebird');

process.env.STRONGLOOP_LICENSE = require('./helpers').shortTestLicense();

var agent = require('../');
var assert = require('assert');
var tap = require('tap');

agent.use([].push.bind([]));  // For side effect.

var DataSource = require('loopback-datasource-juggler').DataSource;

tap.test('loopback-datasource-juggler callbacks', function(t) {
  var ds = new DataSource('memory');
  var User = ds.define('User', {name: {type: String, sort: true}});
  User.create({name: 'alice'}, function() {
    User.create({name: 'bob'}, function() {
      User.create({name: 'eve'}, function() {
        User.find({name: {like: '%'}}, function(err, result) {
          t.equal(result[0].name, 'alice');
          t.equal(result[1].name, 'bob');
          t.equal(result[2].name, 'eve');
          User.deleteAll({name: {like: '%'}}, function(err, result) {
            t.equal(result.count, 3);
            t.end();
          });
        });
      });
    });
  });
});

tap.test('loopback-datasource-juggler promises', function(t) {
  var ds = new DataSource('memory');
  var User = ds.define('User', {name: {type: String, sort: true}});
  User.create({name: 'alice'}).then(function() {
    User.create({name: 'bob'}).then(function() {
      User.create({name: 'eve'}).then(function() {
        User.find({name: {like: '%'}}).then(function(result) {
          t.equal(result[0].name, 'alice');
          t.equal(result[1].name, 'bob');
          t.equal(result[2].name, 'eve');
          User.deleteAll({name: {like: '%'}}).then(function(result) {
            t.equal(result.count, 3);
            t.end();
          });
        });
      });
    });
  });
});
