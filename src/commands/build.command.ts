// todo: add load from config file, TBD
import path = require('path');
import Listr = require('listr');
import cpy = require('cpy');
const del = require('del');

import { build } from '../tasks/build.task';
import { findSubmodules } from '../utils/submodules-resolution';
import { buildPkgs } from '../tasks/npm/build-pkg-json.task';
import { tasksWatch } from '../utils/tasks-watch';

export function buildTsCommand({project, verbose, clean, local}) {
  // 1. clean dist folders
  // 2.1 merge pkg json
  // todo: 2.2 validate pkg (main, module, types fields)
  // 2.3 write pkg
  // 3. compile ts
  return findSubmodules(project, {local})
    .then(opts => new Listr([
      {
        title: 'Clean dist folders',
        task: () => new Listr([
          ...opts.map(opt => ({
            title: `Cleaning ${opt.dist}`,
            task: () => del(opt.dist)
          }))
        ]),
        skip: () => !clean
      },
      {
        title: 'Copy md files and license',
        task: () => Promise.all(opts.map(opt => Promise.all([
          cpy(['*.md', 'LICENSE'], opt.dist),
          cpy([path.join(opt.src, '*.md'), path.join(opt.src, 'LICENSE')], opt.dist)
        ])))
      },
      {
        title: "Build package.json files",
        task: () => buildPkgs(opts, {local})
      },
      {
        title: 'Build projects',
        task: () => new Listr([
          ...opts.map(opt => ({
            title: `Building ${opt.pkg.name} (${opt.src})`,
            task: () => build(opt.project, {tsc: true})
              .catch(err => console.error(`\n${err.message}`))
          }))
        ])
      }
    ], {renderer: verbose ? 'verbose' : 'default'}));
}

export function run(cli) {
  const {project, watch, verbose, clean, local} = cli.flags;
  return buildTsCommand({project, verbose, clean, local})
    .then(tasks => tasksWatch({project, tasks, watch}));
}