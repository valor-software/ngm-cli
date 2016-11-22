// todo: load from config project from
// todo: create `concurrent` list of `npm link` for submodules
// todo: build pkg.json recursively, only first level of folders
// todo: watching seems to be more complicated...
// todo: copy readme.md
// todo: better error messages
import path = require('path');
import Listr = require('listr');
import chokidar = require('chokidar');

// import { cleanTs } from '../tasks/clean-ts.task';
// import { buildTs } from '../tasks/build-ts.task';
import { listDirs, isModuleRoot, getOptions } from '../utils/submodules-resolution';

export function run(cli) {
  // convert cli options to b
  const {project, watch, verbose} = cli.flags;

  // form
  listDirs(project)
    .then(dirs => dirs.filter(dir => isModuleRoot(dir)))
    .then(dirs => dirs.map(dir => Object.assign(getOptions(dir), {cli, project, watch, verbose})))
    .then(srcs => console.log(srcs));

  return;
  /*  function runForAllSubModules(fn) {
   return require('../utils/find-submodules').run(project)
   // now we have sub projects with paths relative to root
   .then(dirs => dirs.map(dir => path.join(project, dir)))
   .then(dirs => Promise.all(dirs.map(fn)))
   }
   const tasks = new Listr([
   {
   title: 'Clean TypeScript dist folder',
   task: () => runForAllSubModules(dir => clean(path.resolve(dir)))
   },
   {
   title: "Build package.json",
   task: () => require('../tasks/build-pkg-json-recursively.task') .run(project)
   },
   {
   title: 'Build TypeScript',
   task: () => runForAllSubModules(dir => buildTs(dir, {retry: 1}))
   },
   ], {renderer: verbose ? 'verbose' : 'default'});

   let isRunning = false;

   function runTasks() {
   if (!isRunning) {
   isRunning = true;
   tasks.run(cli)
   .then(() => {
   isRunning = false;
   })
   .catch(err => {
   console.error(`\n${err.message}`);
   isRunning = false;
   });

   }
   }

   runTasks();

   if (watch) {
   chokidar.watch(project, {ignored: /[\/\\]\./})
   .on('change', (event) => {
   console.log(`Changes detected: ${event}`);
   runTasks();
   });
   }*/
}

