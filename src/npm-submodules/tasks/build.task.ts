// todo: split to build ts and ngc
import { BuildMode } from '../types';
const execa = require('execa');

export function build(project:string, {mode}) {
  if (mode === BuildMode.tsc) {
    return execa('tsc', ['-p', project], {preferLocal: true});
  }
  if (mode === BuildMode.ngc) {
    return execa('ngc', ['-p', project], {preferLocal: true});
  }
  throw new Error(`Task configuration issue, please select build with tsc or ngc`);
}