#!/usr/bin/env node
'use strict';
// todo: configurable defaults
// todo: use commander
// todo: add watch mode for ngc
// todo: add ts hack of output
// todo: add copy task (readme and licence by default)
const rootFolder = require('./utils/helpers').ROOT;
const Listr = require('listr');
const execa = require('execa');

const defaultConfigName = 'angular-cli.json';

const devOutDir = 'node_modules';

const path = require('path');

const angularCliJson = require(path.resolve(rootFolder, defaultConfigName));
// todo: support multiply modules
const moduleConf = angularCliJson.module[0];

const outDir = path.resolve(rootFolder, devOutDir, moduleConf.name);
// const outDir = mode === 'development'
//   ? path.resolve(rootFolder, devOutDir, moduleConf.name)
//   : path.resolve(rootFolder, moduleConf.outDir);

// todo: single run <--> watch

const bundle = require('./tasks/bundle-umd').run;

// require('./tasks/clean').run(outDir)
//   .then((res) => require('./tasks/build-ngc').run(moduleConf))
//   .then(() => require('./tasks/copy-package-json').run(outDir, moduleConf))
//   .then(() => bundle(outDir, moduleConf))
//   .then(() => bundle(outDir, moduleConf, true))
//   .then(() => console.log('done'))


const tasks = new Listr([
  {
    title: 'Git',
    task: () => {
      return new Listr([
        {
          title: 'Checking git status',
          task: () => execa.stdout('git', ['status', '--porcelain']).then(result => {
            if (result !== '') {
              throw new Error('Unclean working tree. Commit or stash changes first.');
            }
          })
        },
        {
          title: 'Checking remote history',
          task: () => execa.stdout('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD']).then(result => {
            if (result !== '0') {
              throw new Error('Remote history differ. Please pull changes.');
            }
          })
        }
      ], {concurrent: true});
    }
  },
  {
    title: `Cleaning destination folder: ${outDir}`,
    task: () => require('./tasks/clean').run(outDir)
  },
  {
    title: 'Building with ngc',
    task: () => require('./tasks/build-ngc').run(moduleConf)
  },
  {
    title: 'Copying package.json ',
    task: () => require('./tasks/copy-package-json').run(outDir, moduleConf)
  },
  {
    title: 'Bundling umd version',
    task: () => bundle(outDir, moduleConf)
  },
  {
    title: 'Bundling minified version of umd',
    task: () => bundle(outDir, moduleConf, true)
  }
]);

tasks.run().catch(err => {
  console.error(err);
  console.error('Compilation failed');
  process.exit(1);
});
