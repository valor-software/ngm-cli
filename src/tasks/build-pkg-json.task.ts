import path = require('path');
import { ROOT } from '../utils/helpers';
// const readPkg = require('./../utils/read-package-json').run;
const mergePkg = require('./../utils/merge-package-json').run;
// const writePkg = require('./../utils/write-package-json').run;
// todo: replace
const readPkg = require('read-pkg');
const writePkg = require('write-pkg');

/**
 * Smart merge of package.json files like Object.assign({}, src, dist)
 * @param src - abs path to project src folder
 * @param dist - abs path to project dist folder
 */
export function buildPkgJson(src, dist) {
  // read base package.json
  const basePkg = readPkg.sync(ROOT);
  // read package.json in module root folder
  const modulePkgPath = readPkg.sync(src);
  // merge packages
  const pkg = mergePkg(basePkg, modulePkgPath);
  // write packages
  return writePkg(dist, pkg);
}

export { buildPkgJson as run };