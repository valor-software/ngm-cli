import path = require('path');
import { ROOT } from 'npm-submodules';
import { getWebpackConfig } from '../models/webpack-umd.config';
const webpack = require('webpack');

// todo: move to constants and make it configurable
const bundlesDir = 'bundles';

// Configure build and output;
let lastHash = null;
const webpackOutputOptions = {
  colors: true,
  chunks: true,
  modules: false,
  reasons: false,
  chunkModules: false
};

// export function bundleUmd(dir, moduleConf, minify) {
export function bundleUmd({src, dist, name, main, tsconfig, minify, externals}) {
  const config = getWebpackConfig({
    name: !minify ? `${name}.umd` : `${name}.umd.min`,
    root: path.resolve(ROOT, src),
    entry: path.resolve(ROOT, src, main),
    output: path.resolve(dist, bundlesDir),
    tsconfig: tsconfig,
    externals: externals
  });

  if (minify) {
    config.plugins.unshift(new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }));
  }

  const webpackCompiler = webpack(config);

  const ProgressPlugin = require('webpack/lib/ProgressPlugin');

  webpackCompiler.apply(new ProgressPlugin({profile: false}));

  return new Promise((resolve, reject) => {
    webpackCompiler.run((err, stats) => {
      if (err) {
        if (stats) {
          process.stdout.write(stats.toString(webpackOutputOptions) + '\n');
        }
        return reject(err);
      }

      if (stats.hasErrors()) {
        process.stdout.write(stats.toString(webpackOutputOptions) + '\n');
      }

      return stats.hasErrors() ? reject() : resolve();
    });
  });
}