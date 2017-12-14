const path = require('path');
const execa = require('execa');
const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

import { inlineResources } from '../helpers/inline-resources';
import ROLLUP_GLOBALS from '../models/rollup.globals';

const bundlesDir = 'bundles';


export async function bundleEs2015(config) {
  await inlineResources(config.tmp);
  await execa('ngc', ['-p', config.tmp], { preferLocal: true });
  return rollup.rollup({
    input: path.resolve(config.tmp, 'dist-es2015', config.input.replace('.ts', '')),
    external: Object.keys(ROLLUP_GLOBALS),
    plugins: [
      resolve({
        module: true,
        main: true
      }),
      commonjs({
        include: 'node_modules/**',
      })
    ],
    onwarn: warning => {
      const skip_codes = [
        'THIS_IS_UNDEFINED',
        'MISSING_GLOBAL_NAME'
      ];
      if (skip_codes.indexOf(warning.code) != -1) return;
      console.error(warning);
    }
  }).then(bundle => bundle.write({
    file: path.resolve(config.dist, bundlesDir, config.name + '.es2015.js'),
    name: config.name,
    format: 'es',
    sourcemap: true
  }));

}

