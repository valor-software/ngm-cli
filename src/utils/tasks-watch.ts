import chokidar = require('chokidar');
// todo: use observables?
export function tasksWatch({project, tasks, watch}){
  let isRunning = false;

  runTasks();

  if (watch) {
    chokidar.watch(project, {ignored: /[\/\\]\./})
      .on('change', (event) => {
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
    return tasks.run(cli)
      .then(() => {
        isRunning = false;
      })
      .catch(err => {
        console.error(`\n${err.message}`);
        isRunning = false;
      });
  }
}