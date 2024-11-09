const webpack = require('webpack'); // to access built-in plugins
const path = require('path');

module.exports = env => {
  return {
    devtool: 'source-map',
    context: path.resolve('./src'),
    target: 'web',
    output: {
      path: path.resolve('./build/js/'),
      publicPath: '/public/assets/',
      filename: 'bundle.js'
    },
    plugins: [
      new webpack.ProvidePlugin({
        React: 'react',
        ReactDOM: 'react-dom',
        $: 'jquery',
        jQuery: 'jquery'
      }),
      new webpack.DefinePlugin({
        APP_VERSION: "1"
      })
    ],
    module: {
      rules: [
        {
          test: /\.js/,
          enforce: 'pre',
          exclude: /node_modules/,
          loader: 'eslint-loader',
          options: {
            configFile: './.eslintrc'
          }
        },
        {
          test: /\.js/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', {
              plugins: [
                '@babel/plugin-proposal-class-properties'
              ]
            }]
          }
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.(png|jpg|ttf|eot|svg|woff|woff2)(\?.*$|$)/,
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }
      ]
    }
  };
};
