var gulp = require("gulp")
  , opts = require("./options")
  , util = require("gulp-util")
  , plumber = require("gulp-plumber")
  , jscs = require("gulp-jscs")
  , jshint = require("gulp-jshint")
  , paths = require("./paths")

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
    .pipe(jscs(paths.sources.jscs))
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"))
}
