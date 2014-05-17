var gulp = require("gulp")
var opts = require("./options")
var util = require("gulp-util")
var plumber = require("gulp-plumber")
var browserify = require("gulp-browserify")
var paths = require("./paths")

/**
 * task scripts
 *
 * creates a browserify bundle from `scripts/index`
 */
module.exports = function(){
  return gulp.src(paths.sources.mainScript)
    .pipe(opts.plumber ? plumber() : util.noop())
    .pipe(browserify(
      opts.minify ? {transform : ["uglifyify"]} : {}
    ))
    .pipe(gulp.dest(paths.dist.scripts))
}
