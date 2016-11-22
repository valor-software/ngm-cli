// todo: watch
const execa = require('execa');

export function run(project, opts) {
  return execa('tsc', ['-p', project, '--traceResolution'], {preferLocal: true});
}

