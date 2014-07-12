var gulp = require("gulp")
var opts = require("./options")
var util = require("gulp-util")
var plumber = require("gulp-plumber")
var jade = require("gulp-jade")
var rename = require("gulp-rename")
var paths = require("./paths")
var options = require("./cache/options")

/**
 * task sitemap
 *
 * creates an xml sitemap
 */
module.exports = function(){
  var stream = gulp.src(paths.sources.sitemap)

  options.update()

  return stream
    .pipe(opts.plumber ? plumber() : util.noop())
    .pipe(jade(options.value))
    .pipe(rename("sitemap.xml"))
    .pipe(gulp.dest(paths.dist.pages))
}
