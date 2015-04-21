import fs from "fs"
import path from "path"

import cssnext from "cssnext"

import metalsmith from "metalsmith"
import markdown from "metalsmith-markdown"
import collections from "metalsmith-collections"

import reactTemplates from "./metalsmith/react-templates"

//dev
import watch from "./metalsmith/server/watcher"
import serve from "metalsmith-serve"
import opn from "opn"

import contributions from "../scripts/contributors"
import i18n from "../src/modules/i18n"

import pkg from "../package"

var production = process.argv.indexOf("--production") !== -1

function build(error, contributors) {
  if (error) {throw error}

  var smith = metalsmith(path.join(__dirname, ".."))
  .source("./content")
  .destination("./dist")

  // add default values for md metadata
  .use(
    (files, metadata, cb) => {
      Object.keys(files)
        .filter((file) => file.match(/\.md$/))
        .forEach((file) => {
          const filedata = files[file]
          files[file] = {
            ...filedata,
            template: filedata.template || "Post",
            collection: filedata.collection || (file.indexOf("posts") === 0 ? "posts" : undefined),
            comments: filedata.comments || true,
          }
        })
      cb()
    }
  )

  // first, convert .md to .html
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
      .build((err) => {if (err) {throw err}})
  }

  // dev server
  else {
    smith
      .use(
        watch({
          livereload: 4243,
          paths: {
            "**/*": true,
            "src/modules/**/*": "**/*.md",
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
