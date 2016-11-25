#!/usr/bin/env node
// todo: add support for config file
// todo: add help per command (sample: tsm help build)
// todo: move help to separate file
// todo: add test and e2e commands... (extract from publish)
// todo: add --yarn option
'use strict';
const meow = require('meow');
const updateNotifier = require('update-notifier');

const cli = meow(`
  Usage
    $ tsm <command> [options]
    
  Commands:
    ----------------------------------------------------------------
    build - build typescript projects
      Usage:
          $ tsm build -p src 
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
        
      
    ----------------------------------------------------------------    
    link  - runs 'npm link' in each submodule dist folder
      Usage:
          $ tsm link -p src
      Hint:
        'npm link' doesn't track adding new files, please rerun this command if file was added\removed
      Mandatory options:
          -p DIRECTORY,   Compile the project in the given directory
            --project DIRECTORY
      Optional options:
           --no-deep    By default local submodules will be linked to each other        
      
    ----------------------------------------------------------------
    publish - runs 'npm publish' in each dist submodule folders 
     tag, access, anyBranch, skipCleanup
    ----------------------------------------------------------------
    version - runs 'npm version <version>' in each submodule and than in root folder
    Usage:
        $ tsm version prerelease -p src
    Mandatory options:
        -m MESSAGE,             Commit message when creating a version commit
          --message MESSAGE
        --no-git-tag-version    Do not create a version commit and tag (applied only to root folder)
    ----------------------------------------------------------------
    init - updates root pkg scripts with required commands, adds tsm-readme.md
    
`, {
  alias: {
    m: 'message',
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
  .then(() => {
    cli.flags = Object.assign(cli.flags, {tsc: true});
    return require('../lib/tsm').main(cli.input[0], cli);
  })
  .catch(err => {
    console.error(`\n`, err.stderr || err);
    process.exit(1);
  });