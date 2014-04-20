var gulp = require("gulp")
  , opts = require("./options")
  , util = require("gulp-util")
  , plumber = require("gulp-plumber")
  , jade = require("gulp-jade")
  , rename = require("gulp-rename")
  , paths = require("./paths")
  , options = require("./cache/options")

/**
 * task feed
 *
 * creates xml feed
 */
module.exports = function(){
  var stream = gulp.src(paths.sources.feed)

  options.update()

  return stream
    .pipe(opts.plumber ? plumber() : util.noop())
    .pipe(jade(options.value))
    .pipe(rename(paths.dist.feed))
    .pipe(gulp.dest(paths.dist.pages))
}
