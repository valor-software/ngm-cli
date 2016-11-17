#!/usr/bin/env node
'use strict';
// todo: configurable defaults
// todo: use commander
// todo: add watch mode for ngc
// todo: add ts hack of output
// todo: add copy task (readme and licence by default)
const rootFolder = require('./utils/helpers').ROOT;
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

const cpy = require('cpy');
const bundle = require('./tasks/bundle-umd').run;

require('./tasks/clean').run(outDir)
  .then((res) => require('./tasks/build-ngc').run(moduleConf))
  .then(() => require('./tasks/copy-package-json').run(outDir, moduleConf))
  .then(() => bundle(outDir, moduleConf))
  .then(() => bundle(outDir, moduleConf, true))
  .then(() => console.log('done'))
  .catch(e => {
    console.error(e);
    console.error('Compilation failed');
    process.exit(1);
  });


