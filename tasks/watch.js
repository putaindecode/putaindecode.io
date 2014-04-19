var gulp = require("gulp")
  , server = require("./server")
  , paths = require("./paths")

module.exports = function(){
  gulp.watch(
    paths.sources.stylesheets,
    ["stylesheets"]
  )
  gulp.watch(
    paths.sources.scripts,
    ["scripts"]
  )
  gulp.watch(
    [
      paths.sources.pages,
      paths.sources.partials,
      paths.sources.mixins,
      paths.sources.layouts,
      paths.sources.lang
    ],
    ["pages"]
  )

  gulp.watch(
    [
      paths.dist.public + "/**/*"
    ]
  )
    .on("change", server.livereload)
}
