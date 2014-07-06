var gulp = require("gulp")
var opts = require("./options")
var util = require("gulp-util")
var plumber = require("gulp-plumber")
var myth = require("gulp-myth")
var paths = require("./paths")

/**
 * task stylesheets
 *
 * myth -> css
 */
module.exports = function(){
  return gulp.src(paths.sources.stylesheets + "/index.css")
    .pipe(opts.plumber ? plumber() : util.noop())
    .pipe(myth())
    .pipe(gulp.dest(paths.dist.stylesheets))
}
