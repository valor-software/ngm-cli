#!/usr/bin/env node
'use strict';
// todo: configurable defaults
// todo: use commander|meow
// todo: add watch mode for ngc
// todo: add ts hack of output
// todo: add copy task (readme and licence by default)
// todo: add assets copy
// todo: version/link/publish
// todo: write help
// todo: meow read wrong pkg version?
// todo: pkg copy description, repository and licence
// todo: add command to upgrade ng2 dependencies
import { ROOT } from '../utils/helpers';
import Listr = require('listr');
import cpy  = require ('cpy');
// const Listr = require('listr');
// const execa = require('execa');
// const cpy = require('cpy');

const updateNotifier = require('update-notifier');
// const meow = require('meow');

/*const cli = meow(`
 Usage
 $ ngm
 Options
 Examples
 `);*/

// updateNotifier({pkg: cli.pkg}).notify();

const defaultConfigName = 'angular-cli.json';

const devOutDir = 'node_modules';

const path = require('path');

const angularCliJson = require(path.resolve(ROOT, defaultConfigName));
// todo: support multiply modules
const moduleConf = angularCliJson.module[0];

// const outDir = path.resolve(rootFolder, devOutDir, moduleConf.name);
const outDir = path.resolve(ROOT, moduleConf.outDir);
// const outDir = mode === 'development'
//   ? path.resolve(rootFolder, devOutDir, moduleConf.name)
//   : path.resolve(rootFolder, moduleConf.outDir);

// todo: single run <--> watch

const bundle = require('./../tasks/bundle-umd.task').run;

const tasks = new Listr([
  // {
  //   title: 'Git',
  //   task: () => {
  //     return new Listr([
  //       {
  //         title: 'Checking git status',
  //         task: () => execa.stdout('git', ['status', '--porcelain']).then(result => {
  //           if (result !== '') {
  //             throw new Error('Unclean working tree. Commit or stash changes first.');
  //           }
  //         })
  //       },
  //       {
  //         title: 'Checking remote history',
  //         task: () => execa.stdout('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD']).then(result => {
  //           if (result !== '0') {
  //             throw new Error('Remote history differ. Please pull changes.');
  //           }
  //         })
  //       }
  //     ], {concurrent: true});
  //   }
  // },
  {
    title: `Cleaning destination folder: ${outDir}`,
    task: () => require('./../tasks/clean.task') .run(outDir)
  },
  {
    title: 'Building with ngc',
    task: () => require('./../tasks/build-ngc.task') .run(moduleConf)
  },
  {
    title: 'Copying package.json ',
    task: () => require('./../tasks/build-pkg-json.task')
      .run(ROOT, moduleConf.root, outDir)
  },
  {
    title: 'Bundling umd version',
    task: () => bundle(outDir, moduleConf)
  },
  {
    title: 'Bundling minified version of umd',
    task: () => bundle(outDir, moduleConf, true)
  },
  {
    title: 'Copy md files',
    task: () => cpy(['*.md'], outDir)
  }
]);

tasks.run().catch(err => {
  console.error(err);
  console.error('Compilation failed');
  process.exit(1);
});


