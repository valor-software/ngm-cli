// todo: load from config project from
// todo: create `concurrent` list of `npm link` for submodules
// todo: copy readme.md and .md
// todo: better error messages
// todo: replace promise.all with new Listr(...opts.map), see lint command for example
import path = require('path');
import Listr = require('listr');
import cpy = require('cpy');
import { buildTs } from '../tasks/build-ts.task';
import { del } from '../tasks/clean.task';
import { findSubmodules } from '../utils/submodules-resolution';
import { buildPkgs } from '../tasks/build-pkg-json.task';
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
          title: 'Clean TypeScript dist folders',
          task: () => Promise.all(opts.map(opt => del(opt.dist))),
          skip: () => !clean
        },
        {
          title: "Build package.json",
          // task: () => Promise.all(opts.map(opt => buildPkgJson(opt.src, opt.dist)))
          task: () => buildPkgs(opts, {local})
        },
        {
          title: 'Build TypeScript',
          task: () => Promise.all(opts
            .map(opt => buildTs(opt.project, {retry: 1})
              .catch(err => console.error(`\n${err.message}`)))
          )
        },
        {
          title: 'Copy md files and license',
          task: () => Promise.all(opts.map(opt => cpy(['*.md', 'LICENSE'], opt.dist)))
        }
      ], {renderer: verbose ? 'verbose' : 'default'}));
}

export function run(cli) {
  const {project, watch, verbose, clean, local} = cli.flags;
  return buildTsCommand({project, verbose, clean, local})
    .then(tasks => tasksWatch({project, tasks, watch}));
}