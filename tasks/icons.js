var gulp = require("gulp")
var opts = require("./options")
var util = require("gulp-util")
var plumber = require("gulp-plumber")
var svgSymbols = require("gulp-svg-symbols")

var paths = require("./paths")

module.exports = function(){
  return gulp.src(paths.sources.icons)
    .pipe(opts.plumber ? plumber() : util.noop())
    .pipe(svgSymbols({
      svgId : "putainde-Icon-%f",
      className : ".putainde-Icon-%f",
      fontSize : 512
    }))
    .pipe(gulp.dest(paths.tmp))
}
