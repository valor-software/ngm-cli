const fs = require('fs');
const path = require('path');
const pkgFileName = 'package.json';

function readPackageJson(dir) {
  const pkgPath = path.resolve(dir, pkgFileName);
  return fs.existsSync(pkgPath) ? require(pkgPath) : {};
}

module.exports.run = readPackageJson;
