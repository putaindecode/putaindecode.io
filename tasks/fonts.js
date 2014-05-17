var gulp = require("gulp")
var paths = require("./paths")

/**
 * task fonts
 *
 * copies `fonts` to `dist/fonts`
 */
module.exports = function(){
  return gulp.src(paths.sources.fonts)
    .pipe(gulp.dest(paths.dist.fonts))
}
