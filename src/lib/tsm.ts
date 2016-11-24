
module.exports.main = main;

// command - string, cli.inputs[0]
// cli - meow object
function main(command, cli) {
  // todo: can I generate this?
  return getCommand(command).run(cli);
}

function getCommand(command) {
  switch (command) {
    case 'build': return require('../commands/build-ts.command') ;
    case 'link': return require('../commands/link.command') ;
    case 'version': return require('../commands/version.command');
    default: throw new Error(`You are using unknown command '${command}', 
    please refer to help for a list of available commands`)
  }
}