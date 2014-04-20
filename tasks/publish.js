var gulp = require("gulp")
  , ghPages = require("gulp-gh-pages")
  , paths = require("./paths")

/**
 * publish task
 *
 * publish build in the gh-pages branch
 */
module.exports = function(){
  return gulp.src(paths.dist.public + "**/*")
    .pipe(ghPages({
      remoteUrl : "git@github.com:putaindecode/website.git",
      branch : "gh-pages-test",
      cacheDir : __dirname + "/../.publish"
    }))
}
