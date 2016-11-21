// todo: load from config project from
// todo: create `concurrent` list of `npm link` for submodules
// todo: build pkg.json recursively, only first level of folders
// todo: watching seems to be more complicated...
const Listr = require('listr');

module.exports.run = run;


function run(cli) {
  // convert cli options to b
  const {project, watch} = cli.flags;
  const tasks = new Listr([
    {
      title: 'Clean TypeScript outfolder',
      task: () => require('../tasks/clean-ts.task').run(project)
    },
    {
      title: 'Build typescript',
      task: () => require('../tasks/build-ts.task').run({project, watch})
    },
    {
      title: "Build package.json",
      task: () => require('../tasks/build-pkg-json-recursively.task').run(project)
    },
    {
      title: 'npm link',
      task: () => Promise.resolve('Bar')
    }
  ]);

  return tasks.run(cli);
}