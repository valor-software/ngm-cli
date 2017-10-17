// import { TsmOptions } from '../types';
import { findSubmodules } from '../utils';
import { npmPublish, prepublishGitCheck, npmLink, npmInstall } from '../tasks';
import { npmLinkCommand } from './link.command';
/**
 * Heavily inspired by https://github.com/sindresorhus/np
 * */
const execa = require('execa');
import Listr = require('listr');

export function run(cli, {buildCommand}) {
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
          task: () => buildCommand({project, verbose, clean: true, local: true}),
          skip: () => yolo
        },
        {
          title: 'Link submodules',
          task: () => npmLinkCommand({project, local: true, deep: true, verbose, yarn, here: true}),
          skip: () => yolo
        },
        // publish
        // set numeric package version before publish
        {
          title: 'Build submodules for publish',
          task: () => buildCommand({project, verbose, clean: true, local: false})
        },
        {
          title: 'Publish all submodules',
          task: () => new Listr(opts.map(opt => ({
              title: `npm publish (${opt.pkg.name}) (from: ${opt.dist})`,
              task: () => npmPublish({yarn, cwd: opt.dist, tag, access})
            }))
          ),
          skip: () => skipPublish
        },
        {
         title: 'Pushing tags',
         task: () => execa('git', ['push', '--follow-tags']),
         skip: () => true
         }
      ], {renderer: verbose ? 'verbose' : 'default'});

      return tasks.run();
    });
}
