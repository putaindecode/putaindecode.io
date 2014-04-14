var gulp = require("gulp")
  , plumber = require("gulp-plumber")
  , browserify = require("gulp-browserify")
  , uglify = require("gulp-uglify")
  , paths = require("./paths")
  , server = require("./server")

module.exports = function(){
  return gulp.src(paths.sources.mainScript)
    .pipe(plumber())
    .pipe(browserify())
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist.scripts))
    .pipe(server.livereload())
}
