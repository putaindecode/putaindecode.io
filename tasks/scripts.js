var gulp = require("gulp")
  , opts = require("./options")
  , util = require("gulp-util")
  , plumber = require("gulp-plumber")
  , browserify = require("gulp-browserify")
  , paths = require("./paths")

/**
 * task scripts
 *
 * creates a browserify bundle from `scripts/index`
 */
module.exports = function(){
  return gulp.src(paths.sources.mainScript)
    .pipe(opts.plumber ? plumber() : util.noop())
    .pipe(browserify(
      {transform : ["uglifyify"]}
    ))
    .pipe(gulp.dest(paths.dist.scripts))
}
