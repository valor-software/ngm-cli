// todo: watch
const execa = require('execa');

module.exports.run = run;

function run(project, opts) {
  return execa('tsc', ['-p', project], {preferLocal: true});
}

