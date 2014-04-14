var gulp = require("gulp")
  , connect = require("gulp-connect")
  , gopen = require("gulp-open")
  , paths = require("./paths")

module.exports = {
  start: function(){
    connect.server({
      root: paths.dist.public
    , port: 4242
    , livereload: { port: 4243 }
    })

    // A file must be specified as the src when running options.url or gulp will overlook the task.
    return gulp.src(paths.dist.public + "/index.html")
      .pipe(gopen("", {
        url: "http://localhost:4242"
      }))
  }
, livereload: connect.reload
}
