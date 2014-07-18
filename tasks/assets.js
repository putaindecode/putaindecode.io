var gulp = require("gulp")
var paths = require("./paths")

/**
 * task assets
 *
 * copies assets contents in `dist/`
 */
module.exports = function(){
  return gulp.src(paths.sources.assets)
    .pipe(gulp.dest(paths.dist.assets))
}
