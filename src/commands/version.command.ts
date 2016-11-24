import Listr = require('listr');
import { findSubmodules, TsmOptions } from '../utils/submodules-resolution';
import { npmVersion } from '../tasks/npm-version.task';

// todo: 'npm-link` doesn't track adding new files,
// so watch mode should be added

export function run(cli) {
  const {project, verbose, message, gitTagVersion} = cli.flags;
  const noGitTagVersion = gitTagVersion === false;
  const version = cli.input[1];

  return findSubmodules(project)
    .then((opts: TsmOptions[]) => {
      // 1. version all sub modules
      // 2. version root package
      const tasks = new Listr([
          {
            title: 'Version all submodules',
            task: () => new Listr([
              ...opts.map(opt => ({
                title: `npm version  (${opt.pkg.name}: ${opt.src})`,
                task: () => npmVersion(opt.src, {version, noGitTagVersion: true})
              }))
            ])
          },
          {
            title: 'Version root package',
            task: () => npmVersion('.', {version, message, noGitTagVersion})
          }
        ],{ renderer: verbose ? 'verbose' : 'default' });

      return tasks.run();
    });
}
