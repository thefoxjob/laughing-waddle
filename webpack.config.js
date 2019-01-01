const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');


module.exports = {
  devServer: {
    contentBase: path.resolve(__dirname, 'build'),
    historyApiFallback: true,
    publicPath: '/',
  },
  entry: ['@babel/polyfill', path.resolve(__dirname, 'src/index.jsx')],
  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.ejs'),
      title: '',
    }),
    new MiniCssExtractPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
