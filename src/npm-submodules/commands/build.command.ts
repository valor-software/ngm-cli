// todo: add load from config file, TBD

import path = require('path');
import Listr = require('listr');
import cpy = require('cpy');
const del = require('del');

import { build, buildPkgs } from '../tasks';
import { findSubmodules, tasksWatch } from '../utils';

export function buildTsCommand({project, verbose, clean, local, mode}) {
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
          cpy(['*.md', 'LICENSE'], opt.dist).then(() =>
            cpy([path.join(opt.src, '*.md'), path.join(opt.src, 'LICENSE')], opt.dist))
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
            task: () => build(opt.project, {mode})
              .catch(err => console.error(`\n${err.message}`))
          }))
        )
      }
    ], {renderer: verbose ? 'verbose' : 'default'}));
}

export function buildTsRun(cli) {
  const {project, watch, verbose, clean, local, mode} = cli.flags;
  return buildTsCommand({project, verbose, clean, local, mode})
    .then(tasks => tasksWatch({project, tasks, watch}));
}