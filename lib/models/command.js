

var Command         = require('ember-cli/lib/models/command');
var EOL                 = require('os').EOL;


Command.prototype.printBasicHelp = function() {
  // ember command-name
  var output;
  if (this.isRoot) {
    output = 'Usage: ' + this.name;
  } else {
    output = 'ng ' + this.name;
  }

  output += this._printCommand();
  output += EOL;

  return output;
};

module.exports = Command;