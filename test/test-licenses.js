'use strict';

var tap = require('tap');
var helpers = require('./helpers');
process.env.STRONGLOOP_LICENSE = '';
var agent = require('../');

tap.test('adding licenses', function(t) {
  agent.licenses = [];
  t.ok(!agent.licensed('foo'));
  t.ok(!agent.licensed('bar'));
  t.ok(!agent.licensed('else'));

  agent.addLicense(helpers.shortTestLicense(['foo']));
  t.ok(agent.licensed('foo'));
  t.ok(!agent.licensed('bar'));
  t.ok(!agent.licensed('else'));

  agent.addLicense(helpers.shortTestLicense(['bar']));
  t.ok(agent.licensed('foo'));
  t.ok(agent.licensed('bar'));
  t.ok(!agent.licensed('else'));

  agent.addLicense(helpers.shortTestLicense(['*']));
  t.ok(agent.licensed('foo'));
  t.ok(agent.licensed('bar'));
  t.ok(agent.licensed('else'));
  t.ok(agent.licensed('all the things'));

  t.end();
});

tap.test('multiple licenses', function(t) {
  var multi = [
    helpers.shortTestLicense(['foo']),
    helpers.shortTestLicense(['bar']),
    helpers.shortTestLicense(['else']),
  ];
  agent.licenses = [];

  t.ok(!agent.licensed('foo'));
  t.ok(!agent.licensed('bar'));
  t.ok(!agent.licensed('else'));

  agent.configure({ license: multi.join(':') });
  t.ok(agent.licensed('foo'));
  t.ok(agent.licensed('bar'));
  t.ok(agent.licensed('else'));
  t.ok(!agent.licensed('all the things'));

  t.end();
});
