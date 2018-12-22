/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const dev = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: {
    index: './src/javascripts/index.js',
    admin: './src/javascripts/admin.js',
    donate: './src/javascripts/donate.js',
  },
  externals: {
    vue: 'Vue',
  },
  plugins: [
    // This plugin tears out the common parts of index.js and admin.js
    // into a shared `shared.js` file to be included in both the back-office
    // and the client-side deployments. This will include things like
    // babel-polyfill, Vuejs, lodash functions used in both places, and
    // the NodeSupport CustomEvent lib used to build most of the front end
    new ProgressBarPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'shared',
      chunks: ['index', 'admin'],
    }),
    // This plugin will wholesale replace 'process.env.NODE_ENV' with the
    // value on the right so we need to make sure to wrap it in quotes
    // so it doesn't try to evaluate `production` or `development`
    // as a symbol in scope and takes it as a string instead. This is to
    // tell Vuejs to avoid including in various development dependencies
    // when building for production, thereby optimizing the build a little bit more
    // https://vuejs.org/v2/guide/deployment.html
    // https://webpack.js.org/plugins/define-plugin/
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `"${process.env.NODE_ENV}"`,
      },
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new ExtractTextPlugin('[name].css'),
  ],
  devtool: dev ? 'eval-source-map' : 'source-map',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public', 'build'),
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            postcss: [
              require('stylelint')(),
              require('postcss-reporter')({ clearReportedMessages: true }),
              require('postcss-cssnext')({ browsers: ['last 2 versions'] }),
              require('postcss-color-function')(),
              require('postcss-nested')(),
            ].concat(
              dev
                ? []
                : [
                    require('cssnano')({
                      autoprefixer: false,
                      preset: [
                        'default',
                        {
                          discardComments: {
                            removeAll: true,
                          },
                        },
                      ],
                    }),
                  ],
            ),
          },
        },
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: false,
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                sourceMap: true,
                plugins(loader) {
                  return [
                    require('stylelint'),
                    require('postcss-reporter'),
                    require('postcss-import')({ root: loader.resourcePath }),
                    require('postcss-cssnext')({
                      browsers: ['last 2 versions'],
                    }),
                    require('postcss-color-function')(),
                    require('postcss-nested')(),
                  ].concat(
                    dev
                      ? []
                      : [
                          require('cssnano')({
                            autoprefixer: false,
                            preset: [
                              'default',
                              {
                                discardComments: {
                                  removeAll: true,
                                },
                              },
                            ],
                          }),
                        ],
                  );
                },
              },
            },
          ],
        }),
      },
    ],
  },
};
