import webpack = require('webpack');
// const  TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;

export function getWebpackConfig(config) {
  return {
    mode: 'production',
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
      rules: [
        {
          test: /\.ts$/,
          loader: `ts-loader`,
          exclude: [/\.e2e\.ts$/],
          options: {
            transpileOnly: true,
            configFile: config.tsconfig
          }
        },
        // in main, load css as raw text
        {
          // exclude: styles,
          test: /\.css$/,
          loaders: ['raw-loader', 'postcss-loader']
        }, {
          // exclude: styles,
          test: /\.styl$/,
          loaders: ['raw-loader', 'postcss-loader', 'stylus-loader']
        },
        {
          // exclude: styles,
          test: /\.less$/,
          loaders: ['raw-loader', 'postcss-loader', 'less-loader']
        }, {
          // exclude: styles,
          test: /\.scss$|\.sass$/,
          loaders: ['raw-loader', 'postcss-loader', 'sass-loader']
        }
      ]
    },

    plugins: [
      // new TsConfigPathsPlugin(),
      // fix the warning in ./~/@angular/core/src/linker/system_js_ng_module_factory_loader.js
      new webpack.ContextReplacementPlugin(
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        config.root
      )
    ],

    optimization: {
      minimize: false
    },
    // Hide webpack output because its noisy.
    // noInfo: true,
    // Also prevent chunk and module display output, cleaner look. Only emit errors.
    stats: 'errors-only',
    devServer: {
      stats: 'errors-only'
    },
  };
};
