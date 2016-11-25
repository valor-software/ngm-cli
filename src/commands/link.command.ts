import Listr = require('listr');
import { findSubmodules, TsmOptions } from '../utils/submodules-resolution';
import { npmLink } from '../tasks/npm-link.task';

// todo: 'npm-link` doesn't track adding new files,
// so watch mode should be added

export function npmLinkCommand({project, local, deep, verbose}) {
  const noDeepLinking = deep === false;
  // 1. clean dist folders
  // 2.1 merge pkg json
  // 2.2 validate pkg (main, module, types)
  // 2.3 write pkg
  // 3. compile ts
  return findSubmodules(project, {local})
    .then((opts: TsmOptions[]) => new Listr([
          {
            title: 'Link all submodules',
            task: () => {
              const linkingTasks = new Listr([
                ...opts.map(opt => ({
                  title: `npm link ${opt.pkg.name} (from: ${opt.src})`,
                  task: () => npmLink(opt.dist)
                }))
              ]);

              if (noDeepLinking) {
                return linkingTasks;
              }

              opts.filter(opt => opt.cross.length > 0)
                .forEach(opt => opt.cross
                  .forEach(crossName => linkingTasks.add(
                    {
                      title: `npm link ${crossName} to ${opt.pkg.name} (${opt.src})`,
                      task: () => npmLink(opt.dist, crossName)
                    }
                  )));
              return linkingTasks;
            }
          }
        ], {renderer: verbose ? 'verbose' : 'default'}));
}

export function run(cli) {
  const {project, verbose, local, deep} = cli.flags;
  return npmLinkCommand({project, verbose, local, deep})
    .then(tasks=> tasks.run());
}
