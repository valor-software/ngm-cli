'use strict';
import path = require('path');
const tsconfig = require('tsconfig');

/**
 * Resolves projects outDir in abs dist path
 */
export function getTsOutDir(project: string, outDir: string): Promise<string> {
  if (outDir) {
    return Promise.resolve(path.resolve(outDir));
  }

  return getTsConfig(project)
    .then((tsconf) => path.resolve(
      path.dirname(tsconf.path),
      tsconf.config.compilerOptions.outDir
    ));
}

export function getTsConfig(project) {
  return tsconfig.load(project);
}