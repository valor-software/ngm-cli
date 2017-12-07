import { bundleUmd } from '../tasks';

// build -p e2e/ngm-single/src --main index.ts

const main = 'index.ts';
const opt = {
  src: 'e2e/ngm-single/src',
  dist: 'e2e/ngm-single/dist',
  pkg: {name: 'ng2-module'},
  tsconfig: {config: {}, path: 'e2e/ngm-single/src/tsconfig.json'}
};

bundleUmd({
  src: opt.src,
  dist: opt.dist,
  name: opt.pkg.name,
  tsconfig: opt.tsconfig.path,
  main,
  minify: false
});
