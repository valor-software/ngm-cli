const path = require('path');

const rootFolder = require('../utils/helpers').ROOT;
const readPkg = require('./../utils/read-package-json').run;
const mergePkg = require('./../utils/merge-package-json').run;
const writePkg = require('./../utils/write-package-json').run;

function copyPackageJson(dir, moduleConf) {
  // read base package.json
  const basePkg = readPkg(rootFolder);
  // read package.json in module root folder
  const modulePkgPath = readPkg(path.resolve(rootFolder, moduleConf.root));
  // merge packages
  const pkg = mergePkg(basePkg, modulePkgPath);
  // write packages
  return writePkg(dir, pkg);
}

module.exports.run = copyPackageJson;
