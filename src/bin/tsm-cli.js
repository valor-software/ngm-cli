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
  Options
    -p DIRECTORY, --project DIRECTORY   Compile the project in the given directory
    -w, --watch     Watch input files
    -v, --verbose   Enable verbose mode
  Examples
    $ tsm build
`, {
  alias: {
    p: 'project',
    w: 'watch',
    v: 'verbose'
  }
});

updateNotifier({pkg: cli.pkg}).notify();

// show help and exit by default
if (cli.input.length === 0) {
  return cli.showHelp(0);
}

Promise
  .resolve()
  .then(() => require('../lib/tsm').main(cli.input[0], cli))
  .catch(err => {
    console.error(`\n${err.message}`);
    process.exit(1);
  });