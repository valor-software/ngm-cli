// todo: add load from config file, TBD

import path = require('path');
const Listr = require('listr');
const cpy = require('cpy');
const del = require('del');

import {
  buildPkgs, findSubmodules, tasksWatch, ROOT, ngCliConfName
} from 'npm-submodules';

import { build } from '../tasks';
import { bundleUmd } from '../tasks/bundle-umd.task';

export function buildCommand({project, verbose, clean, local}) {
  // 1. clean dist folders
  // 2.1 merge pkg json
  // todo: 2.2 validate pkg (main, module, types fields)
  // 2.3 write pkg
  // 3. compile ts
  return findSubmodules(project, {local})
    .then(opts => new Listr([
      {
        title: 'Clean dist folders',
        task: () => new Listr(
          opts.map(opt => ({
            title: `Cleaning ${opt.dist}`,
            task: () => del(opt.dist)
          }))
        ),
        skip: () => !clean
      },
      {
        title: 'Copy md files and license',
        task: () => Promise.all(opts.map(opt =>
          cpy(['*.md', 'LICENSE'], opt.dist)
            .then(() =>
              cpy([path.join(opt.src, '*.md'),
                path.join(opt.src, 'LICENSE')], opt.dist))
        ))
      },
      {
        title: "Build package.json files",
        task: () => buildPkgs(opts, {local})
      },
      {
        title: 'Build projects',
        task: () => new Listr(
          opts.map(opt => ({
            title: `Building ${opt.pkg.name} (${opt.src})`,
            task: () => build(opt.project)
          }))
        )
      },
      {
        title: 'Bundling umd version',
        task: () => new Listr(
          opts.map(opt => ({
            title: `Bundling ${opt.pkg.name}`,
            task: () => bundleUmd({
              src: opt.src,
              dist: opt.dist,
              name: opt.pkg.name,
              main: opt.pkg.main,
              minify: false
            })
          }))
        )
        // task: () => bundleUmd(outDir, moduleConf)
      },
      /*{
        title: 'Bundling minified version of umd',
        task: () => bundleUmd(outDir, moduleConf, true),
        skip: () => local
      },
*/
    ], {renderer: verbose ? 'verbose' : 'default'}));
}

export function buildTsRun(cli) {
  const {project, watch, verbose, clean, local} = cli.flags;
  return buildCommand({project, verbose, clean, local})
    .then(tasks => tasksWatch({project, tasks, watch}));
}