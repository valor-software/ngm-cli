'use strict';
const path = require('path');
const tsconfig = require('tsconfig');

module.exports.getTsConfig = getTsConfig;
module.exports.getTsOutDir = getTsOutDir;

/**
 * Resolves projects outDir in abs dist path
 * @param project
 * @param outDir
 * @returns {*}
 */
function getTsOutDir(project, outDir) {
  if (outDir) {
    return Promise.resolve(path.resolve(outDir));
  }

  return getTsConfig(project)
    .then((tsconf) => path.resolve(
      path.dirname(tsconf.path),
      tsconf.config.compilerOptions.outDir
    ));
}

function getTsConfig(project) {
  return tsconfig.load(project);
}