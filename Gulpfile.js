var gulp = require("gulp")

require("./tasks/fixes/marked")

gulp.task("clean", require("./tasks/clean"))

// html
gulp.task("lang", require("./tasks/lang"))
gulp.task("exports", require("./tasks/exports"))
gulp.task("contributors", require("./tasks/contributors"))
gulp.task("pages", ["lang", "exports", "contributors"], require("./tasks/pages"))
gulp.task("feed", ["pages", "lang", "exports"], require("./tasks/feed"))
gulp.task("sitemap", ["lang", "exports"], require("./tasks/sitemap"))

// static assets
gulp.task("public", require("./tasks/public"))
gulp.task("images", require("./tasks/images"))
gulp.task("fonts", require("./tasks/fonts"))

// generated assets
gulp.task("icons", require("./tasks/icons"))
gulp.task("scripts", ["scripts:linting"], require("./tasks/scripts"))
gulp.task("scripts:linting", require("./tasks/scripts-linting"))
gulp.task("stylesheets", require("./tasks/stylesheets"))
gulp.task("stylesheets:all", ["icons"], require("./tasks/stylesheets")) // for first run, to ensure icon css is fresh & ready

// build
gulp.task("dist", [
  "clean",

  "pages",
  "feed",
  "sitemap",

  "public",
  "images",
  "icons",
  "fonts",

  "scripts",
  "stylesheets:all"
])

// dev tasks
gulp.task("server", require("./tasks/server").start)
gulp.task("watch", require("./tasks/watch"))
gulp.task("default", [
  "dist",
  "server",
  "watch"
])

// publish
gulp.task("publish", [
  "dist"
], require("./tasks/publish"))
