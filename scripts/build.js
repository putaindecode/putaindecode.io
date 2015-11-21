import fs from "fs"
import path from "path"
import webpack from "webpack"
import ExtractTextPlugin from "extract-text-webpack-plugin"

import markdownIt from "markdown-it"
import markdownItTocAndAnchor from "markdown-it-toc-and-anchor"
import hljs from "highlight.js"

import pkg from "../package.json"

import builder from "statinamic/lib/builder"
import configurator from "statinamic/lib/configurator"
import prepareDefinedValues from "statinamic/lib/prepare-defined-values"

const config = configurator(pkg)

const sourceBase = "content"
const destBase = "dist"
const root = path.join(__dirname, "..")
const source = path.join(root, sourceBase)
const dest = path.join(root, destBase)

const webpackConfig = {
  devtool: "eval",

  output: {
    path: dest,
    filename: "[name].js",
    publicPath: config.baseUrl.path,
  },

  resolve: {
    extensions: [
      // node default extensions
      ".js",
      ".json",
      // for all other extensions specified directly
      "",
    ],

    root: [
      path.join(root, "node_modules"),
      path.join(root, "web_modules"), // for static (node) build
    ],
  },

  resolveLoader: {
    root: [ path.join(root, "node_modules") ],
  },

  module: {
    // ! \\ note that loaders are executed from bottom to top !
    loaders: [
      //
      // statinamic requirement
      //
      {
        test: /\.md$/,
        loader: "statinamic/lib/md-collection-loader" +
          `?${ JSON.stringify({
            context: source,
            basepath: config.baseUrl.path,
            defaultHead: {
              layout: "Post",
              comments: true,
            },
            feedsOptions: {
              title: pkg.name,
              site_url: pkg.homepage,
            },
            feeds: {
              "feed.xml": {
                collectionOptions: {
                  filter: { layout: "Post" },
                  sort: "date",
                  reverse: true,
                  limit: 20,
                },
              },
            },
          }) }`
        ,
      },
      {
        test: /\.json$/,
        loader: "json-loader",
      },

      // your loaders
      {
        test: /\.js$/,
        loaders: [
          "babel-loader",
          "eslint-loader", // ?fix",
        ],
        exclude: /(statinamic|node_modules)/,
      },
      // css modules
      {
        test: /styles\.css$/,
        loader: ExtractTextPlugin.extract(
          "style-loader",
          [
            "css-loader" + "?" + [
              `localIdentName=${
                config.dev
                ? "[path][name]--[local]--[hash:base64:5]"
                : "[hash:base64]"
              }`,
              "modules",
            ].join("&"),
            "postcss-loader",
          ].join("!"),
        ),
      },
      // for legacy css
      // when this is unused (= we use only css modules)
      // close this
      // https://github.com/putaindecode/putaindecode.io/issues/509
      {
        test: /legacy-css\/.*\.css$/,
        loader: ExtractTextPlugin.extract(
          "style-loader",
          [
            "css-loader",
            "postcss-loader",
          ].join("!"),
        ),
      },
      {
        test: /content\/.*\.(html|ico|jpe?g|png|gif)$/,
        loader: "file-loader?name=[path][name].[ext]&context=./content",
      },
      {
        test: /web_modules\/.*\.(html|ico|jpe?g|png|gif)$/,
        loader: "file-loader?name=_/[path][name].[ext]&context=./web_modules",
      },
      {
        test: /^CNAME$/,
        loader: "file-loader?name=[path][name].[ext]&context=./content",
      },
      {
        test: /\.(svg)$/,
        loaders : [
          "raw-loader",
          "svgo-loader?useConfig=svgo",
        ],
      },
    ],
  },

  svgo: {
    plugins: [
      { removeTitle: true, removeDesc: true },
      { convertColors: { shorthex: false } },
      { convertPathData: false },
    ],
  },

  postcss: (webpack) => [
    require("postcss-import")({ addDependencyTo: webpack }),
    require("postcss-cssnext")({
      features: {
        customMedia: {
          extensions: {
            maxS: "(max-width: 30em)",
            minS: "(min-width: 30.01em)",
            maxM: "(max-width: 50em)",
            minM: "(min-width: 50.01em)",
            maxL: "(max-width: 65em)",
            minL: "(min-width: 65.01em)",
            maxXL: "(max-width: 80em)",
            minXL: "(min-width: 80.01em)",
          },
        },
      },
    }),
  ],

  plugins: [
    new webpack.DefinePlugin(prepareDefinedValues(config.consts)),
  ],

  markdownIt: (
    markdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight: (code, lang) => {
        code = code.trim()
        // language is recognized by highlight.js
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(lang, code).value
        }
        // ...or fallback to auto
        return hljs.highlightAuto(code).value
      },
    })
      .use(markdownItTocAndAnchor, {
        tocFirstLevel: 2,
      })
  ),
}

builder({
  config,
  source,
  dest,

  clientWebpackConfig: {
    ...webpackConfig,

    entry: {
      "statinamic-client": path.join(__dirname, "index-client"),
    },

    plugins: [
      ...webpackConfig.plugins,

      new ExtractTextPlugin("[name].css", { disable: config.dev }),

      ...config.prod && [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false,
          },
        }),
      ],
    ],
  },
  staticWebpackConfig: {
    ...webpackConfig,

    entry: {
      "statinamic-static": path.join(__dirname, "index-static"),
    },

    target: "node",
    externals: [
      ...fs.readdirSync("node_modules").filter((x) => x !== ".bin"),
      "statinamic/lib/md-collection-loader/cache",
    ],
    output: {
      ...webpackConfig.output,
      libraryTarget: "commonjs2",
      path: __dirname,
    },

    plugins: [
      ...webpackConfig.plugins,

      // useless file
      new ExtractTextPlugin("_/[name].css"),
    ],
  },
})
