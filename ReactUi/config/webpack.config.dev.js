const webpack = require('webpack'); // to access built-in plugins
const path = require('path');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.config.common.js');

module.exports = env => {
  return merge(commonConfig(env), {
    entry: [
      'eventsource-polyfill', // necessary for hot reloading with IE
      'webpack-hot-middleware/client?reload=true', //note that it reloads the page if hot module reloading fails.
      './index.js'
    ],
    devServer: {
      contentBase: path.resolve(__dirname, 'src')
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.LoaderOptionsPlugin({ debug: true })
    ]
  });
};