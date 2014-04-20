var gulp = require("gulp")
  , opts = require("./options")
  , util = require("gulp-util")
  , plumber = require("gulp-plumber")
  , exports = require("gulp-jade-exports")
  , cache = require("./cache/exports")
  , paths = require("./paths")

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
