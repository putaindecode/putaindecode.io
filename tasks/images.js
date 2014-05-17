var gulp = require("gulp")
var paths = require("./paths")

/**
 * task images
 *
 * copies `images` contents in `dist/images`
 */
module.exports = function(){
  return gulp.src(paths.sources.images)
    .pipe(gulp.dest(paths.dist.images))
}
