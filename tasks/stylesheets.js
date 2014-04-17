var gulp = require("gulp")
  , opts = require("./options")
  , util = require("gulp-util")
  , plumber = require("gulp-plumber")
  , stylus = require("gulp-stylus")
  , autoprefixer = require("gulp-autoprefixer")
  , paths = require("./paths")
  , path = require("path")
  , server = require("./server")

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
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.dist.stylesheets))
    .pipe(server.livereload())
}
