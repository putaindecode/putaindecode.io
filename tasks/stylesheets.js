var gulp = require("gulp")
  , opts = require("./options")
  , util = require("gulp-util")
  , plumber = require("gulp-plumber")
  , stylus = require("gulp-stylus")
  , rework = require("gulp-rework")
  , reworkPlugins = {
      vars : require("rework-vars"),
      calc : require("rework-calc")
  }
  , autoprefixer = require("gulp-autoprefixer")
  , paths = require("./paths")
  , path = require("path")

/**
 * task stylesheets
 *
 * stylus -> rework -> css
 */
module.exports = function(){
  return gulp.src(paths.sources.mainStylesheet)
    .pipe(opts.plumber ? plumber() : util.noop())
    .pipe(stylus({
      set : [
        "include css"
      ],
      define : {
        module : function(name){
          return path.join(
            "../",
            paths.sources.modules,
            name.string
          )
        }
      }
    }))
    .pipe(
      rework(
        reworkPlugins.vars(),
        reworkPlugins.calc
      ))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.dist.stylesheets))
}
