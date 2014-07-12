var gulp = require("gulp")
var opts = require("./options")
var util = require("gulp-util")
var plumber = require("gulp-plumber")
var jscs = require("gulp-jscs")
var jshint = require("gulp-jshint")
var paths = require("./paths")

/**
 * task scripts:linting
 *
 * jshint + jscs
 */
module.exports = function(){
  return gulp.src([
    paths.sources.scripts,
    "!" + paths.sources.libScripts,
    paths.sources.tasks,
    paths.sources.tests
  ])
  .pipe(opts.plumber ? plumber() : util.noop())
  .pipe(jscs())
  .pipe(jshint())
  .pipe(jshint.reporter("jshint-stylish"))
}
