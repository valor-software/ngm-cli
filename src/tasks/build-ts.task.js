// todo: watch
const execa = require('execa');

module.exports.run = run;

function run(options) {
  const {project, watch} = options;
  const args = ['-p',project];
  if (watch) {
    args.push(['-w']);
  }
  return execa('tsc',['-p',project], {preferLocal: true});
}

