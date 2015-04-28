import fs from "fs"
import path from "path"

import colors from "chalk"
import cssnext from "cssnext"

import metalsmith from "metalsmith"
import markdown from "metalsmith-markdown"
import highlight from "metalsmith-metallic"
import collections from "metalsmith-collections"
import filenames from "./metalsmith/filenames"
import rss from "./metalsmith/rss"
import reactTemplates from "./metalsmith/react-templates"

//dev
import watch from "./metalsmith/server/watcher"
import serve from "metalsmith-serve"
import opn from "opn"

import contributions from "../scripts/contributors"
import i18n from "../src/modules/i18n"
import pkg from "../package"

import logger from "./utils/logger"

var production = process.argv.indexOf("--production") !== -1

// hack to keep original .html as rawhtml
// rename raw html as .rawhtml to rename later (after md/react part)
const rawifyHtml = (files, metadata, cb) => {
  Object.keys(files)
    .filter((file) => file.match(/\.html$/))
    .forEach((file) => {
      files[file.replace(/\.html$/, ".rawhtml")] = files[file]
      delete files[file]
    })
  cb()
}
const unrawifyHtml = (files, metadata, cb) => {
  Object.keys(files)
    .filter((file) => file.match(/\.rawhtml$/))
    .forEach((file) => {
      files[file.replace(/\.rawhtml$/, ".html")] = files[file]
      delete files[file]
    })
  cb()
}

function build(error, contributors) {
  if (error) {throw error}

  var smith = metalsmith(path.join(__dirname, ".."))
  .source("./content")
  .destination("./dist")

  // useful for some homemade plugins
  .use(
    filenames
  )

  .use(rawifyHtml)

  // add default values for md metadata
  .use(
    (files, metadata, cb) => {
      Object.keys(files)
        .filter((file) => file.match(/^posts\/.*\.md$/))
        .forEach((file) => {
          if (files[file].template === undefined) {files[file].template = "Post"}
          if (files[file].collection === undefined) {files[file].collection = "posts"}
          if (files[file].comments === undefined) {files[file].comments = true}
        })
      cb()
    }
  )

  // convert md code to html code highlighted with highlight.js
  .use(
    highlight({

    })
  )

  // convert .md to .html
  .use(
    markdown({
      smartypants: true,
      gfm: true,
      tables: true,
    })
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
    reactTemplates({
      directory: "./src/modules",
      defaultTemplate: "DefaultTemplate",
      baseFile: `base-${production ? "prod" : "dev"}.html`,
      pattern: "**/*.html", // not .md because markdown() plugin rename those already
      data: {
        pkg: pkg,
        production,
        i18n,
        contributors,
      },
    })
  )

  .use(unrawifyHtml)

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
      .build((err) => {if (err) {throw err}})

    setTimeout(() => opn("http://localhost:4242"), 2000)
  }
}

contributions(build)
