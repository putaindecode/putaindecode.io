var gulp = require("gulp")
  , plumber = require("gulp-plumber")
  , jscs = require("gulp-jscs")
  , jshint = require("gulp-jshint")
  , paths = require("./paths")

module.exports = function(){
  return gulp.src([
      paths.sources.scripts,
      "!" + paths.sources.libScripts,
      paths.sources.tasks,
      paths.sources.tests
    ])
    .pipe(plumber())
    .pipe(jscs())
    .pipe(jshint())
    .pipe(jshint.reporter("default"))
}
