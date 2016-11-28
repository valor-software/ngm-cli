import {buildTsRun} from '../commands/build.command';
import {npmLinkRun, npmVersionRun, npmPublishRun} from 'npm-submodules';

// command - string, cli.inputs[0]
// cli - meow object
export function main(command, cli) {
  // todo: can I generate this?
  return getCommand(command)(cli);
}

function getCommand(command) {
  switch (command) {
    case 'build': return buildTsRun;
    case 'link': return npmLinkRun;
    case 'version': return npmVersionRun;
    case 'publish': return npmPublishRun;
    default: throw new Error(`You are using unknown command '${command}', 
    please refer to help for a list of available commands`)
  }
}