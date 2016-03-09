import path from "path"
import webpack from "webpack"
import ExtractTextPlugin from "extract-text-webpack-plugin"

import pkg from "../package.json"
import config from "./config.js"

export default {
  module: {
    loaders: [
      { // statinamic requirement
        test: /\.md$/,
        loader: "statinamic/lib/md-collection-loader" +
          `?${ JSON.stringify({
            context: path.join(config.cwd, config.source),
            basepath: config.baseUrl.path,
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
            defaultHead: {
              layout: "Post",
              comments: true,
            },
          }) }`,
      },
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
        test: /legacy-css(\/|\\).*\.css$/,
        loader: ExtractTextPlugin.extract(
          "style-loader",
          [
            "css-loader",
            "postcss-loader",
          ].join("!"),
        ),
      },
      {
        test: /content(\/|\\).*\.(html|ico|jpe?g|png|gif)$/,
        loader: "file-loader" +
          "?name=[path][name].[ext]&context=" +
          path.join(config.cwd, config.source),
      },
      {
        test: /web_modules(\/|\\).*\.(html|ico|jpe?g|png|gif)$/,
        loader: "file-loader?name=_/[path][name].[ext]&context=./web_modules",
      },
      {
        test: /\.svg$/,
        loaders : [
          "raw-loader",
          "svgo-loader?useConfig=svgo",
        ],
      },

      {
        test: /\.yml$/,
        loaders : [
          "json-loader",
          "yaml-loader",
        ],
      },

      // client side specific loaders are located in webpack.config.client.js
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
        customProperties: {
          variables: {
            colorRed: "#c33",
            colorLightGrey: "#ebeef0",
          },
        },
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

  markdownIt: (
    require("markdown-it")({
      html: true,
      linkify: true,
      typographer: true,
      highlight: (code, lang) => {
        code = code.trim()
        const hljs = require("highlight.js")
        // language is recognized by highlight.js
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(lang, code).value
        }
        // ...or fallback to auto
        return hljs.highlightAuto(code).value
      },
    })
      .use(require("markdown-it-toc-and-anchor"), { tocFirstLevel: 2 })
  ),

  plugins: [
    new ExtractTextPlugin("[name].[hash].css", { disable: config.dev }),
    new webpack.DefinePlugin({ "process.env": {
      NODE_ENV: JSON.stringify(
        config.production ? "production" : process.env.NODE_ENV
      ),
      CLIENT: true,
      REDUX_DEVTOOLS: Boolean(process.env.REDUX_DEVTOOLS),
      STATINAMIC_PATHNAME: JSON.stringify(process.env.STATINAMIC_PATHNAME),
    } }),

    ...config.production && [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),
    ],
  ],

  // ↓ HANDLE WITH CARE ↓ \\

  output: {
    libraryTarget: "commonjs2", // for node usage, undone in client config
    path: path.join(config.cwd, config.destination),
    publicPath: config.baseUrl.path,
  },
}
