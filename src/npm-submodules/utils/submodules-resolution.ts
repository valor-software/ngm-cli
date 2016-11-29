// import { TsmOptions } from '../types';
import { pkgFileName, dependencyKeys, ROOT } from './constants';
const fs = require('fs');
const path = require('path');
const tsconfig = require('tsconfig');
const readPkg = require('read-pkg');

// todo: order by cross dependencies
// todo: add --use-local-dependencies alias --local

/**
 * Will try to find package.json in src folder
 * if not found will search in 1st level of directories
 * Returns list of directories with package.json
 * project - string, relative path to folder
 */
export function findSubmodules(project: string, options?: {local: boolean}) {
  return listDirs(project)
    .then(dirs => orderByCrossDeps(dirs
      .filter(dir => isModuleRoot(dir))
      .map(dir => ({dir, tsconfig: tsconfig.loadSync(dir)}))
      .map(opt => resolveOptions(project, opt)))
    );
}

function listDirs(project: string): Promise<string[]> {
  return Promise.resolve(
    [project].concat(
      fs
        .readdirSync(path.resolve(project))
        .filter(file => fs.statSync(path.resolve(project, file))
          .isDirectory())
        .map(dir => path.join(project, dir))
    ));
}

function isModuleRoot(dir: string) {
  if (fs.existsSync(path.join(dir, pkgFileName))) {
    return !!tsconfig.resolveSync(dir);
  }
  return false;
}

function resolveOptions(project: string, opt): TsmOptions {
  const tsOutDir = opt.tsconfig.config.compilerOptions.outDir;
  const tsConfigDir = path.dirname(opt.tsconfig.path);
  const relTsOutDir = path.relative(ROOT, path.resolve(tsConfigDir, tsOutDir));
  const moduleDir = path.relative(project, opt.dir);
  // tsc out dir
  const dist = relTsOutDir.indexOf(moduleDir) == -1
    ? path.join(relTsOutDir, moduleDir)
    : relTsOutDir;
  // submodule root
  const src = opt.dir;
  // tsconfig project
  return {
    src, dist,
    tsconfig: opt.tsconfig,
    project: path.relative(ROOT, tsConfigDir),
    pkg: readPkg.sync(src)
  };
}

// todo: split it in
// 1. building cross dependencies
// 2. sorting by cross dependencies count
/**
 * */
function orderByCrossDeps(options: TsmOptions[]): TsmOptions[] {
  const pkgName = options.map(opt => opt.pkg.name);
  return options
    .map<TsmOptions>(option => {
      option.cross = [];
      dependencyKeys.forEach(depKey => {
        if (!option.pkg[depKey]) {
          return;
        }
        pkgName.forEach(name => {
          if (name in option.pkg[depKey]) {
            option.cross.push(name);
          }
        });
      });
      return option;
    })
    .sort((a: TsmOptions, b: TsmOptions) => {
      if (a.cross.length === b.cross.length) {
        return 0;
      }

      return a.cross.length > b.cross.length ? 1 : -1;
    });
}