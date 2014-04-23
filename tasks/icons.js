var gulp = require("gulp")
  , iconfontCSS = require("gulp-iconfont-css")
  , iconfont = require("gulp-iconfont")
  , paths = require("./paths")
  , path = require("path")
  , uri = require("./cache/options.js").value.locals.uri

/**
 * task icons
 *
 * creates iconfont from `icons` svgs and generates a
 * css from `stylesheets/template/icons`
 */
module.exports = function(){
  return gulp.src(paths.sources.icons)
    .pipe(iconfontCSS({
      fontName : "icons",
      path : paths.templates.fontStylesheet,
      targetPath : path.join(
        path.relative(paths.dist.icons, __dirname),
        "../..",
        paths.sources.fontStylesheet
      ),
      fontPath : uri(
        paths.dist.fonts,
        paths.dist.stylesheets
      ) + "/"
    }))
    .pipe(iconfont({
      fontName : "icons",
      fixedWidth : true
    }))
    .pipe(gulp.dest(paths.dist.fonts))
}
