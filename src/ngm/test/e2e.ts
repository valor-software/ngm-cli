import { bundleUmd } from '../tasks/bundle-umd.task';

// build -p e2e/ngm-single/src --main index.ts

const main = 'index.ts';
const opt = {
  src: 'e2e/ngm-single/src',
  dist: 'e2e/ngm-single/dist',
  pkg: {name: 'ng2-module'}
};

bundleUmd({
  src: opt.src,
  dist: opt.dist,
  name: opt.pkg.name,
  main,
  minify: false
});