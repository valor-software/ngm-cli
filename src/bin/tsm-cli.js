#!/usr/bin/env node
// todo: setting
'use strict';
const meow = require('meow');
const updateNotifier = require('update-notifier');
// const version = require('./lib/version');
const ui = require('../lib/ui');
// const np = require('./');

const cli = meow(`
	Usage
	  $ tsm <command> [options]
	Options
	  -p DIRECTORY, --project DIRECTORY   Compile the project in the given directory
	  -w, --watch    Watch input files
	Examples
	  $ tsm build
`, {
  alias: {
    p: 'project',
    w: 'watch'
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