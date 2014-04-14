var gulp = require("gulp")
  , iconfontCSS = require("gulp-iconfont-css")
  , iconfont = require("gulp-iconfont")
  , paths = require("./paths")
  , path = require("path")

module.exports = function(){
  return gulp.src(paths.sources.icons)
    .pipe(iconfontCSS({
      fontName: "icons",
      path: paths.templates.fontStylesheet,
      targetPath: path.join(
        path.relative(paths.dist.icons, __dirname),
        "../..",
        paths.sources.fontStylesheet
      ),
      fontPath: path.relative(
        paths.dist.stylesheets,
        paths.dist.fonts
      ) + "/"
    }))
    .pipe(iconfont({
      fontName: "icons",
      fixedWidth: true
    }))
    .pipe(gulp.dest(paths.dist.fonts))
}
