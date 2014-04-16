var gulp = require("gulp")
  , paths = require("./tasks/paths")

require("./tasks/fixes/marked")

gulp.task("server", require("./tasks/server").start)
gulp.task("lang", require("./tasks/lang"))
gulp.task("exports", require("./tasks/exports"))
gulp.task("pages", ["lang", "exports"], require("./tasks/pages"))
gulp.task("feed", ["lang", "exports"], require("./tasks/feed"))
gulp.task("sitemap", ["lang", "exports"], require("./tasks/sitemap"))
gulp.task("icons", require("./tasks/icons"))
gulp.task("fonts", require("./tasks/fonts"))
gulp.task("public", require("./tasks/public"))
gulp.task("images", require("./tasks/images"))
gulp.task("stylesheets", require("./tasks/stylesheets"))
gulp.task("stylesheets:prod", ["icons"], require("./tasks/stylesheets"))
gulp.task("scripts", ["linting"], require("./tasks/scripts"))
gulp.task("linting", require("./tasks/linting"))

gulp.task("watch", require("./tasks/watch"))
gulp.task("publish", ["dist"], require("./tasks/publish"))

// aliases

gulp.task("dist", [
  "public",
  "images",
  "icons",
  "fonts",
  "pages",
  "feed",
  "sitemap",
  "scripts",
  "stylesheets:prod"
])

gulp.task("default", [
  "dist",
  "server",
  "watch"
])
