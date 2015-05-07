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
import watch from "./metalsmith/server/watcher"
import serve from "metalsmith-serve"
import opn from "opn"

// customize marked
import "./marked"

import contributions from "../scripts/contributors"
import i18n from "../src/modules/i18n"
import pkg from "../package"

import logger from "./utils/logger"

const production = process.argv.indexOf("--production") !== -1
const open = process.argv.indexOf("--open") !== -1

const mdToHtmlReplacement = [/\.md$/, ".html"]

function build(error, contributors) {
  if (error) {throw error}

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
        production,
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

  if (production) {
    // ignore for prod only
    // so we can get watch & reload for those files too
    smith
      .build((err) => {
        if (err) {throw err}
        console.log()
        console.log(colors.green("✓ Build completed"))
      })
  }

  // dev server
  else {
    smith
      .use(
        watch({
          log: logger("watcher"),
          livereload: 4243,
          paths: {
            "**/*": true,
            "src/modules/**/*": "**/*.md",
            // css is for now builded for each metalsmith build
            // we need to improve that
            // so for now, saving any css files just rebuild the index
            // in order to get the css too
            "src/css/**/*": "index.md",
          },
        })
      )
      .use(
        serve({
          port: 4242,
        })
      )
      .build((err) => {
        if (err) {throw err}

        if (open) {
          opn("http://localhost:4242")
        }
      })
  }
}

contributions(build)
