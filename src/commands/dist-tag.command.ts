const execa = require('execa');
import Listr = require('listr');
import { npmDistTag } from '../tasks';
import { findSubmodules } from '../utils/index';

export function npmDistTagRun(cli) {
  const {project, verbose, yarn} = cli.flags;
  const cmd = cli.input[1];
  const tag = cli.input[2];

  return findSubmodules(project)
    .then((opts: TsmOptions[]) => {
      const tasks = new Listr([
        {
          title: 'Version all submodules',
          task: () => new Listr(
            opts.map(opt => ({
              title: `npm dist-tag ${cmd} ${opt.pkg.name}@${opt.pkg.version}`,
              task: () => npmDistTag({
                yarn, cmd, tag,
                module: opt.pkg.name,
                version: opt.pkg.version
              })
            }))
          )
        }
      ], {renderer: verbose ? 'verbose' : 'default'});

      return tasks.run();
    });
}
