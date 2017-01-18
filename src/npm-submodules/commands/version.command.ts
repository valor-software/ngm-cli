// import { TsmOptions } from '../types';
const execa = require('execa');
const path = require('path');
import Listr = require('listr');
import { findSubmodules } from '../utils/submodules-resolution';
import { npmVersion } from '../tasks/npm/npm-version.task';

export function run(cli) {
  const {project, verbose, message, gitTagVersion, yarn, skipPush} = cli.flags;
  const noGitTagVersion = gitTagVersion === false;
  const version = cli.input[1];

  if (!version) {
    return Promise.reject('Error: please provide version like (patch, major, prerelase, 1.2.3, etc.');
  }

  return findSubmodules(project)
    .then((opts: TsmOptions[]) => {
      // 1. version all sub modules
      // 2. version root package
      const tasks = new Listr([
        {
          title: 'Version all submodules',
          task: () => new Listr(
            opts.map(opt => ({
              title: `npm version  (${opt.pkg.name}: ${opt.src})`,
              task: () => npmVersion({yarn, src: opt.src, version, noGitTagVersion: true})
            }))
          )
        },
        {
          title: 'git add -A',
          task: () => execa.shell('git add -A'),
          skip: () => noGitTagVersion
        },
        {
          title: 'Version root package',
          task: () => npmVersion({yarn, src: '.', version, message, noGitTagVersion: true})
        },
        {
          title: 'Create version commit',
          task: () => {
            const pkg = require(path.resolve('package.json'));
            return execa.stdout('git', ['commit', '-am', message || pkg.version]);
          },
          skip: () => noGitTagVersion
        },
        {
          title: 'Add tag version',
          task: () => {
            const pkg = require(path.resolve('package.json'));
            return execa.stdout('git', ['tag', pkg.version]);
          },
          skip: () => noGitTagVersion
        },
        {
          title: 'Push to origin with tags',
          task: () => {
            const currentBranch = execa.shellSync(`git branch | sed -n '/\* /s///p'`).stdout;
            return execa.stdout('git', ['push', 'origin', currentBranch, '--tags'])
          },
          skip: () => skipPush
        }
      ], {renderer: verbose ? 'verbose' : 'default'});

      return tasks.run();
    });
}
