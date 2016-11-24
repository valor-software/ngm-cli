#!/usr/bin/env node
// todo: setting
'use strict';
const meow = require('meow');
const updateNotifier = require('update-notifier');

// todo: add help per command (sample: tsm help build)
// todo: move help to separate file

const cli = meow(`
  Usage
    $ tsm <command> [options]
    
  Commands:
    ----------------------------------------------------------------
    build - build typescript projects
      Mandatory options:
        -p DIRECTORY,   Compile the project in the given directory
          --project DIRECTORY
      Optional options (default: false):
        --no-local      Use version numbers from local submodules when building package.json,
                          usually needed only for publish command
        -w, --watch     Watch input files
        -v, --verbose   Enable verbose mode
        --clean         Cleaning dist folders
                          It removes folder, so you will need to rerun commands like 'link', etc...
        
      Usage:
        $ tsm build -p src 
    ----------------------------------------------------------------    
    link  - run 'npm link' in each submodule dist folder
      Hint:
        'npm link' doesn't track adding new files, please rerun this command if file was added\removed
      Mandatory options:
          -p DIRECTORY,   Compile the project in the given directory
            --project DIRECTORY
      Optional options:
           --no-deep    By default local submodules will be linked to each other        
      Usage:
        $ tsm link -p src
    ----------------------------------------------------------------
`, {
  alias: {
    p: 'project',
    w: 'watch',
    v: 'verbose',
    local: 'use-local-dependencies alias'
  }
});

updateNotifier({pkg: cli.pkg}).notify();

// show help and exit by default
if (cli.input.length === 0) {
  cli.showHelp(0);
}

Promise
  .resolve()
  .then(() => require('../lib/tsm').main(cli.input[0], cli))
  .catch(err => {
    console.error(`\n`, err);
    process.exit(1);
  });