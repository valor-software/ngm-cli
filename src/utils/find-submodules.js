const fs = require('fs');
const path = require('path');

const {pkgName} = require('../utils/constants');

module.exports.run = run;

/**
 * Will try to find package.json in src folder
 * if not found will search in 1st level of directories
 * Returns list of directories with package.json
 * project - string, relative path to folder
 */
function run(project) {
  // check package json in project root
  if (fs.existsSync(path.resolve(project, pkgName))) {
    return Promise.resolve([path.resolve(project)]);
  }

  return Promise.resolve(
    fs.readdirSync(path.resolve(project))
      .map(file => path.resolve(project, file))
      .filter(file => fs.statSync(file).isDirectory())
      .filter(dir => fs.existsSync(path.resolve(dir, pkgName)))
      .map(dir => path.relative(project, dir))
  );
}
