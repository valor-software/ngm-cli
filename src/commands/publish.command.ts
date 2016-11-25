import { skip } from 'rxjs/operator/skip';
/**
 * Heavily inspired by https://github.com/sindresorhus/np
 * */
const execa = require('execa');
import Listr = require('listr');
import { findSubmodules, TsmOptions } from '../utils/submodules-resolution';
import { npmPublish } from '../tasks/npm-publish';
import { prepublishGitCheck } from './prepublish-git-check';
import { del } from '../tasks/clean.task';
import { buildTsCommand } from '../../dist/commands/build-ts.command';
import { npmLinkCommand } from './link.command';
import { npmLink } from '../tasks/npm-link.task';

export function run(cli) {
  const {project, verbose, tag, access, anyBranch, skipCleanup} = cli.flags;

  return findSubmodules(project)
    .then((opts: TsmOptions[]) => {
      const tasks = new Listr([
        {
          title: 'Git prepublish checks',
          task: () => prepublishGitCheck({anyBranch})
        },
        // test command
        {
          title: 'Node modules cleanup',
          task: () => del('node_modules'),
          skip: () => skipCleanup
        },
        {
          // todo: maybe install only dev dependencies
          title: 'Installing dependencies',
          task: () => execa('npm', ['install']),
          skip: () => skipCleanup
        },
        {
          title: 'Running unit tests tests',
          task: () => execa('npm', ['test']),
          skip: () => skipCleanup
        },
        // e2e command
        {
          title: 'Build submodules for e2e',
          task: () => buildTsCommand({project, verbose, clean: true, local: true})
        },
        {
          title: 'Link submodules',
          task: () => npmLinkCommand({project, local: true, deep: true, verbose})
        },
        {
          title: 'Link submodules to local project',
          task: () => new Listr([
            ...opts.map(opt => ({
              title: `npm link ${opt.pkg.name}`,
              task: () => npmLink('.', opt.pkg.name)
            }))
          ])
        },
        // todo: set numeric package version before publish
        {
          title: 'Build submodules for e2e',
          task: () => buildTsCommand({project, verbose, clean: true, local: false})
        },
        {
          title: 'Publish all submodules',
          task: () => new Listr([
            ...opts.map(opt => ({
              title: `npm publish ${opt.pkg.name}) (${opt.src})`,
              task: () => npmPublish(opt.dist, {tag, access})
            }))
          ]),
          skip: () => true
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
