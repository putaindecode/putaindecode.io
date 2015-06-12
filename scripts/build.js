import path from "path"

import {sync as rm} from "rimraf"
import async from "async"
import colors from "chalk"

import Metalsmith from "metalsmith"
import defaultMetadata from "./metalsmith/default-metadata"
import markdown from "metalsmith-md"
import collections from "metalsmith-collections"
import addFilenames from "metalsmith-filenames"
import url from "metalsmith-url"
import rename from "metalsmith-rename"
import rss from "metalsmith-rss"
import react from "metalsmith-react"

import webpack from "webpack"
import webpackConfig from "../webpack.config"

// prod
import copyWithContentHash from "copy-with-content-hash/hash-file"

// dev
import watch from "metalsmith-watch"
import devServer from "./webpack-dev-server"

// customize marked
import "./marked"

import contributions from "../scripts/contributors"
import i18n from "../src/modules/i18n"
import pkg from "../package"
import logger from "nano-logger"

import variables, {defineGlobalVariables} from "../variables"
defineGlobalVariables()
const DEV_SERVER = process.argv.includes("--dev-server")

console.log(colors.cyan("\n- Variables"))
console.log(variables)

const mdToHtmlReplacement = [/\.md$/, ".html"]

function build(contributors) {
  // We clean ./dist by hand mainly for prod, in order to be able to build
  // assets with webpack before metalsmith build.
  // This allows us to get hashes in filename and pass them to the build
  rm("./dist")

  const smith = new Metalsmith(path.join(__dirname, ".."))
  smith
  .clean(false)
  .source("./content")
  .destination("./dist")

  // add default values for md metadata
  .use(
    defaultMetadata()
  )

  // convert markdown
  .use(
    markdown({
      baseHref: `${__SERVER_URL__}/`,
    })
  )

  // useful for some homemade plugins
  .use(
    addFilenames()
  )

  // add url meta data with some replacements
  .use(
    url([
      mdToHtmlReplacement,
      [/index\.html?$/, ""],
    ])
  )

  // allow looping on post for listing
  .use(
    collections({
      posts: {
        sortBy: "date",
        reverse: true,
      },
    })
  )

  .use(
    rss({
      feedOptions: {
        title: i18n.title,
        site_url: __SERVER_URL__,
        language: "fr",
        categories: [
          "code",
        ],
      },
      destination: "feed.xml",
    })
  )

  // wrap .html into react `template:`
  .use(
    react({
      pattern: "**/*.md",
      templatesPath: "./src/layouts",
      defaultTemplate: "Default",
      before: "<!doctype html>",
      data: {
        pkg: pkg,
        metadata: smith.metadata(),
        i18n,
        contributors,
      },
    })
  )

  .use(
    rename([
      mdToHtmlReplacement,
    ])
  )

  // for development, we build metalsmith first, then we serve via
  // webpack-dev-server which build assets too (no hashes involved)
  if (DEV_SERVER) {
    smith.metadata().assets = {
      scripts: [
        "/index.js",
        `http://${__SERVER_HOSTNAME__}:${__LR_SERVER_PORT__}/livereload.js`,
      ],
      // css is handled by the js via webpack style-loader
    }
    smith
      .use(
        watch({
          log: logger("watcher"),
          livereload: __LR_SERVER_PORT__,
          paths: {
            "${source}/**/*": true,
            "src/layouts/**/*": "**/*.md",
            "src/modules/**/*": "**/*.md",
          },
        })
      )
      .build((err) => {
        if (err) {
          throw err
        }

        devServer({
          protocol: __SERVER_PROTOCOL__,
          host: __SERVER_HOSTNAME__,
          port: __SERVER_PORT__,
          open: process.argv.includes("--open"),
        })
      })
  }

  // for production we build assets first to be able to pass some assets hashes
  // to metalsmith
  else {
    webpack(webpackConfig, (err) => {
      if (err) {
        throw err
      }

      console.log(colors.green("\n✓ Assets build completed"))

      async.map(
        [
          "index.js",
          "index.css",
        ],
        (file, cb) => copyWithContentHash(`dist/${file}`, false, cb),
        (asynErr, results) => {
          if (asynErr) {
            throw asynErr
          }

          smith.metadata().assets = {
            scripts: ["/" + results[0]],
            stylesheets: ["/" + results[1]],
          }
          smith
            .build(buildErr => {
              if (buildErr) {
                throw buildErr
              }

              console.log(colors.green("\n✓ Static build completed"))
            })
        }
      )
    })
  }
}

contributions()
  .then((contributors) => build(contributors))
  .catch(err => {
    throw err
  })
