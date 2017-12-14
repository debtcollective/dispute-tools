const path = require('path');

const dev = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: './src/javascripts/index.js',
  devtool: dev ? 'inline-source-map' : 'source-map',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'public', 'build'),
  },
  module: {
    loaders: [
      { test: /\.vue$/, use: 'vue-loader' },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['transform-vue-jsx'],
          },
        },
      },
    ],
  },
};
