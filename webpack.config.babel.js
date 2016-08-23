import path from "path"

import webpack from "webpack"
import ExtractTextPlugin from "extract-text-webpack-plugin"
import {
  phenomicLoader,
  phenomicLoaderPresets,
  phenomicLoaderPlugins,
} from "phenomic"

import pkg from "./package.json"

// note that this webpack file is exporting a "makeConfig" function
// which is used for phenomic to build dynamic configuration based on your needs
// see the end of the file if you want to export a default config
// (eg: if you share your config for phenomic and other stuff)
export const makeConfig = (config = {}) => {
  return {
    ...config.dev && {
      devtool: "#cheap-module-eval-source-map",
    },
    module: {
      noParse: /\.min\.js/,
      loaders: [
        {
          // phenomic requirement
          test: /\.md$/,
          loader: phenomicLoader,
        },
        {
          test: /\.json$/,
          loader: "json-loader",
        },
        {
          test: /\.js$/,
          loaders: [
            `babel-loader${
              config.dev
              ? "?cacheDirectory=true&presets[]=babel-preset-react-hmre"
              : "?cacheDirectory=true"
            }`,
            "eslint-loader?fix",
          ],
          include: [
            path.resolve(__dirname, "scripts"),
            path.resolve(__dirname, "web_modules"),
          ],
        },
        {
          test: /styles\.css$/,
          loader: ExtractTextPlugin.extract(
            "style-loader",
            "css-loader" + (
              "?modules"+
              "&localIdentName=" +
              (
                process.env.NODE_ENV === "production"
                ? "[hash:base64:5]"
                : "[path][name]--[local]--[hash:base64:5]"
              ).toString()
            ) + "!" +
            "postcss-loader",
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
      ],
    },

    phenomic: {
      context: path.join(__dirname, config.source),
      plugins: [
        ...phenomicLoaderPresets.default,
        ...phenomicLoaderPresets.markdown,
        phenomicLoaderPlugins.initRawBodyPropertyFromContent,
      ],
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

    plugins: [
      new ExtractTextPlugin("[name].[hash].css", { disable: config.dev }),
      ...config.production && [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin(
          { compress: { warnings: false } }
        ),
      ],
    ],

    output: {
      path: path.join(__dirname, config.destination),
      publicPath: config.baseUrl.pathname,
      filename: "[name].[hash].js",
    },

    // https://github.com/MoOx/phenomic/issues/656
    ...config.static && {
      externals: [
        /fs-promise/,
      ],
    },

    // resolve: {
    //   extensions: [ ".js", ".json", "" ],
    //   root: [ path.join(__dirname, "node_modules") ],
    // },
    // resolveLoader: { root: [ path.join(__dirname, "node_modules") ] },
  }
}

// you might want to export a default config for another usage ?
// export default makeConfig()
