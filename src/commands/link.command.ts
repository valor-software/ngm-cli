import Listr = require('listr');
import { findSubmodules, TsmOptions } from '../utils/submodules-resolution';
import { npmLink } from '../tasks/npm-link.task';

export function run(cli) {
  const {project, watch, verbose, clean, local} = cli.flags;
  return findSubmodules(project, {local})
    .then((opts:TsmOptions[]) => {
      // 1. clean dist folders
      // 2.1 merge pkg json
      // 2.2 validate pkg (main, module, types)
      // 2.3 write pkg
      // 3. compile ts
      const tasks = new Listr([
        {
          title: 'Link all submodules',
          task: () => Promise.all(opts.map(opt => npmLink(opt.dist)))
        }
      ], {renderer: verbose ? 'verbose' : 'default'});

     return tasks.run();
    });
}
