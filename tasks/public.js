var gulp = require("gulp")
var paths = require("./paths")

/**
 * task public
 *
 * copies `public` contents in `dist`
 */
module.exports = function(){
  return gulp.src(paths.sources.public)
    .pipe(gulp.dest(paths.dist.public))
}
