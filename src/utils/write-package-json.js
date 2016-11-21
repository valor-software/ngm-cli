//todo: delete this file | replaced with write-pkg module
const fs = require('fs');
const path = require('path');
const {pkgName} = require('../utils/constants');

function writePackageJson(dir, pkg) {
  // write to target directory
  return new Promise((resolve, reject) => {
    try {
      const pkgStr = JSON.stringify(pkg, null, '  ');
      fs.writeFileSync(path.resolve(dir, pkgName), pkgStr);
      return resolve();
    } catch (e) {
      return reject(e);
    }
  });
}

module.exports.run = writePackageJson;
