// todo: delete this file | replaced with read-pkg module
const fs = require('fs');
const path = require('path');
const {pkgName} = require('../utils/constants');

function readPackageJson(dir) {
  const pkgPath = path.resolve(dir, pkgName);
  return fs.existsSync(pkgPath) ? require(pkgPath) : {};
}

module.exports.run = readPackageJson;
