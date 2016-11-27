/**
 * Heavily inspired by https://github.com/sindresorhus/np
 * */
const execa = require('execa');
import Listr = require('listr');

import { findSubmodules, TsmOptions } from '../utils/submodules-resolution';

import { npmPublish } from '../tasks/npm/npm-publish.task';
import { prepublishGitCheck } from '../tasks/prepublish-git-check.task';
import { npmLink } from '../tasks/npm/npm-link.task';
import { npmInstall } from '../tasks/npm/npm-install.task';

import { buildTsCommand } from './build.command';
import { npmLinkCommand } from './link.command';

export function run(cli) {
  const {
    project, verbose, tag, access, anyBranch,
    skipCleanup, skipGitCheck, yarn, yolo, skipPublish
  } = cli.flags;

  return findSubmodules(project)
    .then((opts: TsmOptions[]) => {
      const tasks = new Listr([
        {
          title: 'Git checks',
          task: () => prepublishGitCheck({anyBranch}),
          skip: () => skipGitCheck || yolo
        },
        // test command
        {
          title: 'Installing dependencies',
          task: () => new Listr(npmInstall({skipCleanup, yarn})),
          skip: () => yolo
        },
        {
          title: 'Running unit tests tests',
          task: () => execa('npm', ['test']),
          skip: () => yolo
        },
        // e2e command
        {
          title: 'Build submodules for e2e',
          task: () => buildTsCommand({project, verbose, clean: true, local: true}),
          skip: () => yolo
        },
        {
          title: 'Link submodules',
          task: () => npmLinkCommand({project, local: true, deep: true, verbose, yarn}),
          skip: () => yolo
        },
        {
          title: 'Link submodules to local project',
          task: () => new Listr(opts.map(opt => ({
              title: `npm link ${opt.pkg.name}`,
              task: () => npmLink({yarn, cwd: '.', module: opt.pkg.name})
            }))
          ),
          skip: () => yolo
        },
        // publish
        // set numeric package version before publish
        {
          title: 'Build submodules for publish',
          task: () => buildTsCommand({project, verbose, clean: true, local: false}),
          skip: () => skipPublish
        },
        {
          title: 'Publish all submodules',
          task: () => new Listr(opts.map(opt => ({
              title: `npm publish ${opt.pkg.name}) (${opt.src})`,
              task: () => npmPublish({yarn, cwd: opt.dist, tag, access})
            }))
          ),
          skip: () => skipPublish
        },
        /*{
          title: 'Pushing tags',
          task: () => execa('git', ['push', '--follow-tags']),
          skip: () => true
        }*/
      ], {renderer: verbose ? 'verbose' : 'default'});

      return tasks.run();
    });
}
