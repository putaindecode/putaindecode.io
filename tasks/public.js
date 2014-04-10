var gulp = require("gulp")
  , paths = require("./paths")

module.exports = function(){
  return gulp.src(paths.sources.public)
    .pipe(gulp.dest(paths.dist.public))
}
