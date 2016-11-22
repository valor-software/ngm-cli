'use strict';
const path = require('path');
const tsConf = require('../utils/read-tsconfig-json');

module.exports.run = run;

function run(project, outDir) {
  return tsConf
    .getTsOutDir(project, outDir)
    .then((dir) => require('./clean.task')
      .run(path.resolve(project, dir)));
}