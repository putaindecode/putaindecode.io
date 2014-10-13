var gulp = require("gulp")
var opts = require("./options")
var util = require("gulp-util")
var plumber = require("gulp-plumber")
var cssnext = require("gulp-cssnext")
var paths = require("./paths")

/**
 * task stylesheets
 *
 * cssnext -> css
 */
module.exports = function(){
  return gulp.src(paths.sources.stylesheets + "/index.css")
    .pipe(opts.plumber ? plumber() : util.noop())
    .pipe(cssnext({sourcemap : opts.debug}))
    .pipe(gulp.dest(paths.dist.stylesheets))
}
