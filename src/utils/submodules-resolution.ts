const fs = require('fs');
const path = require('path');
const tsconfig = require('tsconfig');
const readPkg = require('read-pkg');
import { pkgName } from './constants';

/**
 * Will try to find package.json in src folder
 * if not found will search in 1st level of directories
 * Returns list of directories with package.json
 * project - string, relative path to folder
 */
export function run(project: string): Promise<string[]> {
  // check package json in project root
  if (fs.existsSync(path.resolve(project, pkgName))) {
    return Promise.resolve([path.resolve(project)]);
  }

  return Promise.resolve(
    listDirs(project).then(dirs =>
      dirs.filter(dir => fs
        .existsSync(path.resolve(dir, pkgName)))
        .map(dir => path.relative(project, dir))
    ));
}

export function listDirs(project: string): Promise<string[]> {
  return Promise.resolve(
    [project].concat(
      fs
        .readdirSync(path.resolve(project))
        .filter(file => fs.statSync(path.resolve(project, file)).isDirectory())
        .map(dir => path.join(project, dir))
    ));
}

export function isModuleRoot(dir: string) {
  if (fs.existsSync(path.join(dir, pkgName))) {
    return !!tsconfig.resolveSync(dir);
  }
  return false;
}

export function getOptions(dir:string): any {
  return {
    tsconfig: tsconfig.loadSync(dir),
    pkg: readPkg.sync(dir)
  }
}