var gulp = require("gulp")
  , paths = require("./paths")

module.exports = function(){
  return gulp.src(paths.sources.fonts)
    .pipe(gulp.dest(paths.dist.fonts))
}
