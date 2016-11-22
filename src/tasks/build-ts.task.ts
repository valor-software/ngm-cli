// todo: watch
const execa = require('execa');

export function run(project:string, opts?: any) {
  return execa('tsc', ['-p', project, '--traceResolution'], {preferLocal: true});
}

export {run as buildTs};