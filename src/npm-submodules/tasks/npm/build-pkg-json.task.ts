import path = require('path');
import { ROOT } from '../../utils/constants';
import { mergePackageJson} from '../../utils/merge-package-json';
// import { TsmOptions } from '../../types';
// todo: replace
const readPkg = require('read-pkg');
const writePkg = require('write-pkg');

/**
 * Smart merge of package.json files like Object.assign({}, src, dist)
 * @param opts
 * @param localDependencies
 * @param options
 */
export function buildPkgJson(opts:TsmOptions, localDependencies, options: {local: boolean}) {
  // read base package.json
  const base = readPkg.sync(ROOT);
  // read package.json in module root folder
  const module = readPkg.sync(opts.src);
  // merge packages
  localDependenciesVersionFallback(base, localDependencies);
  const pkg = mergePackageJson({base, module, localDependencies});
  pkg.version = pkg.version || base.version;
  // write packages
  // todo: for some reason, read pkg ignores readme.md and says that readme not found, and this is not true
  delete pkg.readme;
  return writePkg(opts.dist, pkg);
}

/**
 *
 * @param tsmOptions
 * @param options
 */
export function buildPkgs(tsmOptions:TsmOptions[], options: {local: boolean}) {
  // 0. read base package.json
  // 1. read all sub module packages
  // 2. include sub module versions in modules hash
  // if options.local === true, resolve local dependencies as file paths: "module-a": "../module-a"
  // in general you need non relative dependencies only before publishing
  const localDependencies = tsmOptions.reduce((memo, val)=>{
    memo[val.pkg.name] = !options.local ? val.pkg.version : path.resolve(val.dist);
    return memo;
  }, {});
  // 3. merge packages
  return Promise.all(tsmOptions.map(optPkg => buildPkgJson(optPkg, localDependencies, options)));
  // 4. validate required fields in packages
  // todo:
}

function localDependenciesVersionFallback(base, localDependencies) {
  for (let pkgName in localDependencies) {
    localDependencies[pkgName] = localDependencies[pkgName] || base.version;
  }
}
