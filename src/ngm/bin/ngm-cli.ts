#!/usr/bin/env node
// todo: add support for config file
// todo: add help per command (sample: tsm help build)
// todd: add test and e2e command (cut of from publish tasks)
// todo: move help to separate file
// todo: use Observables

import { BuildMode } from 'npm-submodules';
const meow = require('meow');
const updateNotifier = require('update-notifier');

// init - updates root pkg scripts with required commands, adds tsm-readme.md

const cli = meow(`
  Usage
    $ ngm <command> [options]
    
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
        'npm link' doesn't track adding new files, please rerun this command if file was added/removed
      Mandatory options:
          -p DIRECTORY,   Compile the project in the given directory
            --project DIRECTORY
      Optional options:
           --no-deep    By default local submodules will be linked to each other        
      
    ----------------------------------------------------------------
    publish - runs 'npm publish' in each dist submodule folders, how it works:
    
      1. Runs git checks (you should be on master branch, without changes in working tree, and up to date with remote history
      --any-branch - disables on 'master' check
      --skip-git-check - to skip all git checks
      
      2. Performs clean install of dependecies
      --yarn - to install dependencies with 'yarn'
      --skip-cleanup - to not delete 'node_modules' before installing
      
      3. Running tests (npm test) from root folder
      
      4. Running e2e test (npm run e2e), all submodules will be built in local mode and linked (npm link)
      
      5. Publishing, with separate clean build
      --skip-publish - skip publishing and clean build, in case you want to double check something
      --tag - same as 'npm publish --tag next', use in case you want new release without changing 'latest' npm tag
      --access - same as 'npm publish --access p*'
      Steps 1-4 can be skipped with --yolo flag
      
    ----------------------------------------------------------------
    version - runs 'npm version <version>' in each submodule and than in root folder
    Usage:
        $ tsm version prerelease -p src
    Mandatory options:
        -m MESSAGE,             Commit message when creating a version commit
          --message MESSAGE
        --no-git-tag-version    Do not create a version commit and tag (applied only to root folder)
    ----------------------------------------------------------------
    
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

import { main } from '../lib/ngm';

Promise
  .resolve()
  .then(() => {
    cli.flags = Object.assign(cli.flags, {mode: BuildMode.ngc});
    return main(cli.input[0], cli);
  })
  .then(() => {
    // console.log('Mission complete!');
  })
  .catch(err => {
    console.error(`\n`, err.stderr || err);
    process.exit(1);
  });