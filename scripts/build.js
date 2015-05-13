import fs from "fs"
import path from "path"

import colors from "chalk"
import cssnext from "cssnext"

import Metalsmith from "metalsmith"
import defaultMetadata from "./metalsmith/default-metadata"
import markdown from "metalsmith-md"
import collections from "metalsmith-collections"
import addFilenames from "metalsmith-filenames"
import url from "metalsmith-url"
import rename from "metalsmith-rename"
import rss from "metalsmith-rss"
import react from "metalsmith-react"

//dev
import watch from "metalsmith-watch"
import webpack from "webpack"
import webpackConfig from "../webpack.config"
import devServer from "./webpack-dev-server"

// customize marked
import "./marked"

import contributions from "../scripts/contributors"
import i18n from "../src/modules/i18n"
import pkg from "../package"
import logger from "./utils/logger"

import {defineGlobalVariables} from "../variables"
defineGlobalVariables()
const DEV_SERVER = process.argv.includes("--dev-server")

const mdToHtmlReplacement = [/\.md$/, ".html"]

function build(error, contributors) {
  if (error) {
    throw error
  }

  const smith = new Metalsmith(path.join(__dirname, ".."))
  .source("./content")
  .destination("./dist")

  // add default values for md metadata
  .use(
    defaultMetadata()
  )

  // convert markdown
  .use(
    markdown()
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
        site_url: pkg.homepage,
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
      templatesPath: "./src/modules",
      defaultTemplate: "DefaultTemplate",
      before: "<!doctype html>",
      data: {
        pkg: pkg,
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

  // build css
  .use(
    (files, metadata, cb) => {
      files["index.css"] = {
        contents: new Buffer(
          cssnext(
            fs.readFileSync("./src/css/index.css", {encoding: "utf-8"}),
            {
              from: "./src/css/index.css",
              to: "./dist/index.css",
            }
          )
        ),
      }
      cb()
    }
  )

  if (!DEV_SERVER) {
    // ignore for prod only
    // so we can get watch & reload for those files too
    smith
      .build((err) => {
        if (err) {
          throw err
        }

        console.log(colors.green("\n✓ Static build completed"))
      })
    webpack(webpackConfig, (err) => {
      if (err) {
        throw err
      }

      console.log(colors.green("\n✓ Assets build completed"))
    })
  }

  // dev server
  else {
    smith
      .use(
        watch({
          log: logger("watcher"),
          livereload: __LR_SERVER_PORT__,
          paths: {
            "${source}/**/*": true,
            "src/modules/**/*": "**/*.md",
            // css is for now builded for each metalsmith build
            // we need to improve that
            // so for now, saving any css files just rebuild the index
            // in order to get the css too
            "src/css/**/*": "index.md",
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
}

contributions(build)
