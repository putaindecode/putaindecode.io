var gulp = require("gulp")
  , paths = require("./paths")

module.exports = function(){
  return gulp.src(paths.sources.images)
    .pipe(gulp.dest(paths.dist.images))
}
