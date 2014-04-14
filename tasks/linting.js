var gulp = require("gulp")
  , plumber = require("gulp-plumber")
  , browserify = require("gulp-browserify")
  , jshint = require("gulp-jshint")
  , paths = require("./paths")
  , server = require("./server")

module.exports = function(){
  return gulp.src(paths.sources.scripts)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter("default"))
}
