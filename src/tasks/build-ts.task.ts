const execa = require('execa');

export function buildTs(project:string, opts?: any) {
  return execa('tsc', ['-p', project], {preferLocal: true});
}