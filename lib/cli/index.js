var exit = require('exit');
var cli = require('./cli');


cli({
  cliArgs: process.argv.slice(2),
  inputStream: process.stdin,
  outputStream: process.stdout,
  errorStream: process.stderr
}).then(function(result) {
  var exitCode = typeof result === 'object' ? result.exitCode : result;
  exit(exitCode);
});
