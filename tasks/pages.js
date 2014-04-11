var gulp = require("gulp")
  , plumber = require("gulp-plumber")
  , jade = require("gulp-jade")
  , exports = require("./cache/exports")
  , lang = require("./cache/lang")
  , paths = require("./paths")
  , path = require("path")
  , lodash = require("lodash")
  , jadeExtenstionRE = /\.jade$/
  , marked = require("marked")

marked.setOptions({
  highlight: function (code) {
    return require("highlight.js").highlightAuto(code).value;
  }
})

module.exports = function(){
  var options = {
        basedir : path.resolve(__dirname, "../"),
        locals : {
          pages : exports.value,
          lang : lang.value,
          path : path,
          getPages : function(object){
            return lodash.where(exports.value, object)
          }
        }
      }
    , stream = gulp.src(paths.sources.pages)

  stream.on("data", function(file){
    options.locals.page = path.relative(
      path.resolve(paths.sources.pagesRoot), file.path
    ).replace(jadeExtenstionRE, "")
  })

  return stream
    .pipe(plumber())
    .pipe(jade(options))
    .pipe(gulp.dest(paths.dist.pages))
}
