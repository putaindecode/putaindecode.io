var gulp = require("gulp")
  , opts = require("./options")
  , util = require("gulp-util")
  , plumber = require("gulp-plumber")
  , jade = require("gulp-jade")
  , paths = require("./paths")
  , path = require("path")
  , jadeExtenstionRE = /\.jade$/
  , options = require("./cache/options")
  , server = require("./server")

module.exports = function(){
  var stream = gulp.src(paths.sources.pages)

  options.update()

  stream.on("data", function(file){
    options.value.locals.page = path.relative(
      path.resolve(paths.sources.pagesRoot), file.path
    ).replace(jadeExtenstionRE, "")
  })

  return stream
    .pipe(opts.plumber ? plumber() : util.noop())
    .pipe(jade(options.value))
    .pipe(gulp.dest(paths.dist.pages))
    .pipe(server.livereload())
}
