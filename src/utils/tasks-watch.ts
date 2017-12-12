import chokidar = require('chokidar');
import path = require('path');
// todo: use observables?
export function tasksWatch({project, tasks, watch, paths}){
  let isRunning = false;
  let changedModule: number;

  runTasks();

  if (watch) {
    chokidar.watch(project, {ignored: /[\/\\]\./})
      .on('change', (event) => {
        changedModule = paths.indexOf(event.split(path.sep)[0]);
        console.log(`Changes detected: ${event}`);
        runTasks();
      });
  }

  return Promise.resolve();

  function runTasks() {
    if (isRunning) {
      return;
    }

    isRunning = true;
    tasks.tasks.forEach((task: any, i: number) => {
      task.skip = () => changedModule && i !== changedModule;
    });
    return tasks.run()
      .then(() => {
        console.log(`\n-------------------------------------\n`);
        isRunning = false;
      })
      .catch(err => {
        console.error(`\n${err.message}`);
        isRunning = false;
      });
  }
}
