import {npmLinkRun, npmVersionRun, npmPublishRun} from 'npm-submodules';
import { buildTsRun, buildCommand } from '../commands';

// command - string, cli.inputs[0]
// cli - meow object
export function main(command, cli) {
  // todo: can I generate this?
  return run(command, cli);
}

function run(command, cli) {
  switch (command) {
    case 'build': return buildTsRun(cli);
    case 'link': return npmLinkRun(cli);
    case 'version': return npmVersionRun(cli);
    case 'publish': return npmPublishRun(cli, {buildCommand});
    default: throw new Error(`You are using unknown command '${command}', 
    please refer to help for a list of available commands`)
  }
}