#!/usr/bin/env node
// todo: setting
'use strict';
const meow = require('meow');
const updateNotifier = require('update-notifier');

const cli = meow(`
  Usage
    $ tsm <command> [options]
  Commands
    build - build typescript project
    link  - run 'npm link' in each submodule dist folder
  Options
    -p DIRECTORY, --project DIRECTORY   Compile the project in the given directory
  Build options
    -w, --watch     Watch input files
    -v, --verbose   Enable verbose mode
    --clean         Cleaning dist folders
    --local,        Use local(relative paths) for resolving submodules cross dependencies
      --use-local-dependencies alias
  Examples
    $ tsm build
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