var gulp = require("gulp")
var cache = require("./cache/lang")
var paths = require("./paths")

/**
 * task lang
 *
 * reads the lang/index.json and stores it in `tasks/cache/lang`
 */
module.exports = function(){
  var src = gulp.src(paths.sources.lang)
  src.on("data", function(buffer){
    cache.value = JSON.parse(buffer.contents.toString())
  })
  return src
}
