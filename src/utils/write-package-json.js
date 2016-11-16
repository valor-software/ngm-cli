const fs = require('fs');
const path = require('path');
const pkgFileName = 'package.json';

function writePackageJson(dir, pkg) {
  // write to target directory
  return new Promise((resolve, reject) => {
    try {
      const pkgStr = JSON.stringify(pkg, null, '  ');
      fs.writeFileSync(path.resolve(dir, pkgFileName), pkgStr);
      return resolve();
    } catch (e) {
      return reject(e);
    }
  });
}

module.exports.run = writePackageJson;
