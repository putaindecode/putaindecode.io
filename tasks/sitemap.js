var gulp = require("gulp")
  , opts = require("./options")
  , util = require("gulp-util")
  , plumber = require("gulp-plumber")
  , jade = require("gulp-jade")
  , rename = require("gulp-rename")
  , paths = require("./paths")
  , options = require("./cache/options")

/**
 * task sitemap
 *
 * creates an xml sitemap
 */
module.exports = function(){
  var stream = gulp.src(paths.sources.sitemap)

  options.update()

  return stream
    .pipe(opts.plumber ? plumber() : util.noop())
    .pipe(jade(options.value))
    .pipe(rename(paths.dist.sitemap))
    .pipe(gulp.dest(paths.dist.pages))
}
