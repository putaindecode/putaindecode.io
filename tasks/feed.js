var gulp = require("gulp")
var opts = require("./options")
var util = require("gulp-util")
var plumber = require("gulp-plumber")
var jade = require("gulp-jade")
var rename = require("gulp-rename")
var paths = require("./paths")
var options = require("./cache/options")

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
    .pipe(rename("feed.xml"))
    .pipe(gulp.dest(paths.dist.pages))
}
