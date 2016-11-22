'use strict';
import path = require('path');

import { getTsOutDir } from '../utils/read-tsconfig-json';
import { clean } from './clean.task';

export function run(project, outDir?) {
  return getTsOutDir(project, outDir)
    .then((dir) => clean(path.resolve(project, dir)));
}

export {run as cleanTs};