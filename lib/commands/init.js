'use strict';

var path            = require('path');
var Command         = require('ember-cli/lib/models/command');
var lookupCommand   = require('ember-cli/lib/cli/lookup-command');
var string          = require('ember-cli/lib/utilities/string');
var assign          = require('lodash/assign');
var GenerateCommand = require('ember-cli/lib/commands/generate');
var versionUtils    = require('ember-cli/lib/utilities/version-utils');
var emberCLIVersion = versionUtils.emberCLIVersion;

var RootCommand = Command.extend({
  isRoot: true,
  name: 'gen',

  anonymousOptions: [
    '<command (Default: help)>'
  ]
});

module.exports = Command.extend({
  name: 'init',
  description: 'Initialize a project.',
  aliases: ['i'],
  works: 'everywhere',

  availableOptions: [
    { name: 'test', type: Boolean, default: false, aliases: ['t'] },
    { name: 'force', type: Boolean, default: false, aliases: ['f'] }
  ],

  run: function(commandOptions, rawArgs) {
    this.ui.writeLine("Initilizing a new directory structure.")
  }
});
