import path from "path"

import webpack from "webpack"

import ExtractTextPlugin from "extract-text-webpack-plugin"
import eslintFormatter from "eslint-friendly-formatter"

import variables, {defineGlobalVariables} from "./variables"
defineGlobalVariables()

const production = process.argv.includes("--production")

var config = {
  entry: {
    __tests__: [
      "./src/__tests__.js",
    ],
    index: [
      "./src/index.js",
    ],
  },

  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    publicPath: "/",
  },

  resolve: {
    extensions: [
      "",
      ".js",
      ".css",
    ],
  },

  module: {
    // ! \\ note that loaders are executed from bottom to top !
    loaders: [
      {
        test: /\.(jsx?|es)$/,
        loaders: [
          "babel?" + JSON.stringify({
            stage: 0,
          }),
          "eslint",
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loaders: [
          "json",
        ],
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          "style",
          "css!cssnext"
        ),
      },
      {
        test: /\.html$/,
        loaders: [
          "file?name=[path][name].[ext]&context=./src",
        ],
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin(variables),
    new ExtractTextPlugin("[name].css", {disable: !production}),
    ...(production ?
        [
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false,
            },
          }),
        ] :
        []
    ),
  ],

  node: {
    // https://github.com/webpack/webpack/issues/451
    // run tape test with webpack
    fs: "empty",
  },

  eslint: {
    reporter: eslintFormatter,
  },
}

export default config
