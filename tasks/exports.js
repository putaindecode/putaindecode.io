var gulp = require("gulp")
  , plumber = require("gulp-plumber")
  , exports = require("gulp-jade-exports")
  , cache = require("./cache/exports")
  , paths = require("./paths")

module.exports = function(){
  var exportsPipe = exports()
  exportsPipe.on("end", function(){
    cache.value = exports.exports
  })
  return gulp.src(paths.sources.pages)
    .pipe(plumber())
    .pipe(exportsPipe)
}
