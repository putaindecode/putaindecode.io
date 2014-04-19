var gulp = require("gulp")

require("./tasks/fixes/marked")

/**
 * task lang
 *
 * reads the lang/index.json and stores it in `tasks/cache/lang`
 */
gulp.task("lang", require("./tasks/lang"))

/**
 * task exports
 *
 * reads all pages' exports blocks and make and stores them
 * in `tasks/cache/exports`
 */
gulp.task("exports", require("./tasks/exports"))

/**
 * task pages
 *
 * compiles jade to html with `exports`, `lang` and `tasks/cache/options`
 * available
 */
gulp.task("pages", ["lang", "exports"], require("./tasks/pages"))

/**
 * task feed
 *
 * creates xml feed
 */
gulp.task("feed", ["pages", "lang", "exports"], require("./tasks/feed"))

/**
 * task sitemap
 *
 * creates an xml sitemap
 */
gulp.task("sitemap", ["lang", "exports"], require("./tasks/sitemap"))

/**
 * task public
 *
 * copies `public` contents in `dist`
 */
gulp.task("public", require("./tasks/public"))

/**
 * task images
 *
 * copies `images` contents in `dist/images`
 */
gulp.task("images", require("./tasks/images"))

/**
 * task icons
 *
 * creates iconfont from `icons` svgs and generates a
 * css from `stylesheets/template/icons`
 */
gulp.task("icons", require("./tasks/icons"))

/**
 * task fonts
 *
 * copies `fonts` to `dist/fonts`
 */
gulp.task("fonts", require("./tasks/fonts"))

/**
 * task scripts
 *
 * creates a browserify bundle from `scripts/index`
 */
gulp.task("scripts", ["scripts:linting"], require("./tasks/scripts"))

/**
 * task scripts:linting
 *
 * jshint + jscs
 */
gulp.task("scripts:linting", require("./tasks/scripts-linting"))

/**
 * task stylesheets
 *
 * stylus -> rework -> css
 */
gulp.task("stylesheets", require("./tasks/stylesheets"))

/**
 * task stylesheets
 *
 * stylesheets after icons css has been generated
 */
gulp.task("stylesheets:all", ["icons"], require("./tasks/stylesheets")) // for first run, to ensure icon css is fresh & ready

// build
gulp.task("dist", [
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
gulp.task("publish", ["dist"], require("./tasks/publish"))
