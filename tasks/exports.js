var gulp = require("gulp")
var opts = require("./options")
var util = require("gulp-util")
var plumber = require("gulp-plumber")
var exports = require("gulp-jade-exports")
var cache = require("./cache/exports")
var paths = require("./paths")

/**
 * task exports
 *
 * reads all pages' exports blocks and make and stores them
 * in `tasks/cache/exports`
 */
module.exports = function(){
  var exportsPipe = exports()
  exportsPipe.on("end", function(){
    cache.value = exports.exports
  })
  return gulp.src(paths.sources.pages)
    .pipe(opts.plumber ? plumber() : util.noop())
    .pipe(exportsPipe)
}
