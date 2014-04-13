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
  , renderer = new marked.Renderer()
  , options

marked.setOptions({
  highlight: function (code) {
    return require("highlight.js").highlightAuto(code).value;
  },
  renderer : renderer
})

renderer.image = function (href, title, text) {
  if(href.indexOf("http") != 0) {
    href = options.locals.path.relative(options.locals.page, "images/posts/" + href)
  }
  var output = "<img src=\"" + href + "\" alt=\"" + text + "\""
  if (title) {
    output += " title=\"" + title + "\""
  }
  output += this.options.xhtml ? "/>" : ">"
  return output
}

module.exports = function(){
  var stream = gulp.src(paths.sources.pages)

  options = {
    basedir : path.resolve(__dirname, "../"),
    locals : {
      pages : exports.value,
      lang : lang.value,
      path : {
        relative : function(from, to){
          return path.relative(from.replace(/index$/, ""), to)
        },
        join : path.join
      },
      getPages : function(object){
        return lodash.where(exports.value, object)
      }
    }
  }

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
