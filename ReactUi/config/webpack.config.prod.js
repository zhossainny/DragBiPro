const webpack = require('webpack'); // to access built-in plugins
const path = require('path');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.config.common.js');

module.exports = env => {
  return merge(commonConfig(env), {
    entry: [
      './index.js'
    ],
    plugins: [
      new webpack.LoaderOptionsPlugin({
        minimize: true
      }),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: false,
        beautify: false,
        mangle: {
          screw_ie8: true,
          keep_fnames: true
        },
        compress: {
          screw_ie8: true
        },
        comments: false
      })
    ]
  });
};