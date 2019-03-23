let path = require("path");
let HtmlWebpackPlugin = require("html-webpack-plugin");
let outputDir = path.join(__dirname, "build/");
let CopyWebpackPlugin = require("copy-webpack-plugin");
let ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");

let isProd = process.env.NODE_ENV === "production";

module.exports = {
  stats: "minimal",
  entry: "./src/Main.bs.js",
  mode: isProd ? "production" : "development",
  output: {
    path: outputDir,
    publicPath: "/",
    filename: "[hash].js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html"
    }),
    new HtmlWebpackPlugin({
      filename: "prerender/__source.html",
      template: "src/index.html"
    }),
    new CopyWebpackPlugin([
      { from: "**/*", to: "./public", context: "./public" }
    ]),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: "defer"
    })
  ],
  resolve: {
    alias: {
      emotion: path.join(__dirname, "src/vendor/emotion.js")
    }
  },
  devServer: {
    contentBase: outputDir,
    compress: true,
    port: process.env.PORT || 8000,
    historyApiFallback: true,
    host: "0.0.0.0"
  }
};
