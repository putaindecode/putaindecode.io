var gulp = require("gulp")
var consolidate = require("gulp-consolidate")
var iconfont = require("gulp-iconfont")
var paths = require("./paths")
var uri = require("./cache/options.js").value.locals.uri

/**
 * task icons
 *
 * creates iconfont from `icons` svgs and generates a
 * css from `stylesheets/template/icons`
 */
module.exports = function(){
  return gulp.src(paths.sources.icons)
    .pipe(iconfont({
      fontName : "icons",
      fixedWidth : true
    }))
    .on("codepoints", function(codepoints){
      gulp.src(paths.templates.fontStylesheet)
        .pipe(consolidate("lodash", {
          glyphs : codepoints,
          fontName : "icons",
          fontPath : uri(paths.dist.fonts, paths.dist.stylesheets) + "/"
        }))
        .pipe(gulp.dest(paths.sources.iconStylesheets))
    })
    .pipe(gulp.dest(paths.dist.icons))
}
