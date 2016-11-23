import path = require('path');
import { ROOT } from '../utils/helpers';
const mergePkg = require('./../utils/merge-package-json').run;
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

export function buildPackages(opts, basePkg) {
  // 0. read base package.json
  const basePkg = readPkg.sync(ROOT);
  // 1. read all sub module packages
  const optsPkg = opts.map(opt => Object.assign(opt, {pkg: readPkg.sync(opt.src)}))
  // 2. include sub module versions in modules hash
  // 3. merge packages
  // 4. validate required fields in packages
}
