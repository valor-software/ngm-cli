'use strict';

const webpack = require('webpack');
module.exports = (config) => {
  return {
    devtool: 'source-map',

    resolve: {
      extensions: ['.ts', '.js']
    },

    entry: config.entry,

    output: {
      path: config.output,
      publicPath: '/',
      filename: `${config.name}.js`,
      libraryTarget: 'umd',
      library: config.name
    },

    // require those dependencies but don't bundle them
    externals: [/^\@angular\//, /^rxjs\//],

    module: {
      rules: [{
        test: /\.ts$/,
        loader: `awesome-typescript-loader?declaration=false&tsconfig=${config.tsconfig}`,
        exclude: [/\.e2e\.ts$/]
      }]
    },

    plugins: [
      // fix the warning in ./~/@angular/core/src/linker/system_js_ng_module_factory_loader.js
      new webpack.ContextReplacementPlugin(
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        config.root
      )
    ]
  };
}
