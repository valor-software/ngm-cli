'use strict';
const path = require('path');

const findSubmodules = require('../utils/find-submodules').run;
const buildPkgJson = require('./build-pkg-json.task').run;
const getTsOutDir = require('../utils/read-tsconfig-json').getTsOutDir;
module.exports.run = run;

function run(project) {
  return findSubmodules(project)
    // map dir abs paths to {src, dist} pares
    .then((dirs) => Promise.all(
      dirs.map(moduleDir => {
        const absModuleDir = path.resolve(project, moduleDir);
        // todo: this one could be an issue, make a helper method
        return getTsOutDir(absModuleDir)
          .then(dist => ({
            moduleDir,
            src: absModuleDir,
            dist: path.resolve(dist, moduleDir)
          }))
      })
    ))
    .then((opts) => Promise.all(
      opts.map(opt => buildPkgJson(opt.src, opt.dist))
    ));
}
