// todo: split to build ts and ngc
const execa = require('execa');

export function build(project:string, opts) {
  const {tsc, ngc} = opts;
  if (tsc) {
    return execa('tsc', ['-p', project], {preferLocal: true});
  }
  if (ngc) {
    return execa('ngc', ['-p', project], {preferLocal: true});
  }
  throw new Error(`Task configuration issue, please select build with tsc or ngc`);
}