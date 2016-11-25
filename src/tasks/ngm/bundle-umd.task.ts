import path = require('path');
import { ROOT } from '../../utils/constants';
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
const webpack = require('webpack');

function bundleUmd(dir, moduleConf, minify) {
  const config = require('../../models/webpack-umd.config')({
    name: !minify ? `${moduleConf.name}.umd` : `${moduleConf.name}.umd.min`,
    root: path.resolve(ROOT, moduleConf.root),
    entry: path.resolve(ROOT, moduleConf.root, moduleConf.main),
    output: path.resolve(dir, bundlesDir),
    tsconfig: path.join(moduleConf.root, moduleConf.tsconfig || 'tsconfig.json')
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

module.exports.run = bundleUmd;
