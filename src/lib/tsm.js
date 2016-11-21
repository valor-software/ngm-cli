
module.exports.main = main;

// command - string, cli.inputs[0]
// cli - meow object
function main(command, cli) {
  console.log(`running ${command}`);
  // todo: can I generate this?
  return getCommand(command).run(cli);
}

function getCommand(command) {
  switch (command) {
    case 'build': return require('../commands/build-ts.command');
    default: throw new Error(`You are using unknown command '${command}', 
    please refer to help for a list of available commands`)
  }
}