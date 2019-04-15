'use strict';

module.exports = {
  entry: './src/client/index.js',
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/
    }]
  },
  output: {
    path: __dirname + '/public/js',
    filename: 'bundle.js',
    publicPath: '/public/js'
  },
  devtool: 'inline-source-map'
};
