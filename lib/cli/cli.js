'use strict';

// Main entry point
var Project       = require('ember-cli/lib/models/project');
var requireAsHash = require('ember-cli/lib/utilities/require-as-hash');
var Command       = require('ember-cli/lib/models/command');
var commands      = requireAsHash('../commands/*.js', Command);
var Task          = require('ember-cli/lib/models/task');
var tasks         = requireAsHash('ember-cli/lib/tasks/*.js', Task);
var CLI           = require('ember-cli/lib/cli/cli');
var merge         = require('lodash/merge');
var path          = require('path');

function clientId() {
  var ConfigStore = require('configstore');
  var configStore = new ConfigStore('gen-cli');
  var id = configStore.get('client-id');

  if (id) {
    return id;
  } else {
    id = require('node-uuid').v4().toString();
    configStore.set('client-id', id);
    return id;
  }
}

// Options: Array cliArgs, Stream inputStream, Stream outputStream
module.exports = function(options) {
  var UI = options.UI || require('ember-cli/lib/ui');
  var Yam = options.Yam || require('yam');

  // TODO: one UI (lib/models/project.js also has one for now...)
  var ui = new UI({
    inputStream:  options.inputStream,
    outputStream: options.outputStream,
    errorStream:  options.errorStream || process.stderr,
    ci:           process.env.CI || /^(dumb|emacs)$/.test(process.env.TERM),
    writeLevel:   ~process.argv.indexOf('--silent') ? 'ERROR' : undefined
  });

  var config = new Yam('gen-cli', {
    primary: Project.getProjectRoot()
  });

  var defaultUpdateCheckerOptions = {
    checkForUpdates: false
  };

  (function (orig) {
      ui.writeLine = function (message) {
          orig(message.replace(/ember/g, "gen"));
      };
  }(ui.writeLine.bind(ui)));


  var cli = new CLI({
    ui:        ui,
    analytics: {
        track : function () {}
    },
    testing:   options.testing,
    name: options.cli ? options.cli.name : 'gen',
    disableDependencyChecker: options.disableDependencyChecker,
    root: options.cli ? options.cli.root : path.resolve(__dirname, '..', '..'),
    npmPackage: options.cli ? options.cli.npmPackage : 'gen-cli'
  });

  var project = Project.projectOrnullProject(ui, cli);

  var environment = {
    tasks:    tasks,
    cliArgs:  options.cliArgs,
    commands: commands,
    project:  project,
    settings: merge(defaultUpdateCheckerOptions, config.getAll())
  };

  return cli.run(environment);
};
