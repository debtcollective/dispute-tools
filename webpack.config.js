var webpack = require('webpack');
var path = require('path');
var CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  entry: path.join(__dirname, '/public/js/application.js'),
  output: {
    path: path.join(__dirname, './public/dist'),
    filename: 'bundle.js',
    sourceMap : '[file].map'
  },
  resolve: {
    // you can now require('file') instead of require('file.js')
    extensions: ['', '.js', '.json', '.less']
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader!autoprefixer-loader?browsers=last 2 version' },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=application/font-woff" },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&minetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,     loader: "url?limit=10000&minetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,     loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,     loader: "url?limit=10000&minetype=image/svg+xml" },
      { test: /\.(png|jpg)$/,                   loader: 'url-loader?limit=8192'}, // inline base64 URLs for <=8k images, direct URLs for the rest
      { test: /\.less$/,                        loader: "style-loader!css-loader!autoprefixer-loader?browsers=last 2 version!less-loader"}
    ]
  },
  plugins: [
    new CompressionPlugin({
      asset: "{file}.gz",
      algorithm: "gzip",
      regExp: /\.js$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ],

  resolve: {
   alias: {
      jquery: path.join(__dirname, "/public/js/vendor/jquery-2.0.3.js" ),
      validate: path.join(__dirname, "/public/js/vendor/validate.js" )
    }
  }
};
