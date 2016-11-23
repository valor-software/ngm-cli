import path = require('path');
import { ROOT } from '../utils/helpers';
import { mergePackageJson} from '../utils/merge-package-json';
import { TsmOptions } from '../utils/submodules-resolution';
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
  const pkg = mergePackageJson({base, module, localDependencies});
  // write packages
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
    memo[val.pkg.name] = options.local === false ? val.pkg.version : path.resolve(val.dist);
    return memo;
  }, {});
  // 3. merge packages
  return Promise.all(tsmOptions.map(optPkg => buildPkgJson(optPkg, localDependencies, options)));
  // 4. validate required fields in packages
  // todo:
}
