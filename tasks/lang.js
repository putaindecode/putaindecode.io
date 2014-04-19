var gulp = require("gulp")
  , cache = require("./cache/lang")
  , paths = require("./paths")

module.exports = function(){
  var src = gulp.src(paths.sources.lang)
  src.on("data", function(buffer){
    cache.value = JSON.parse(buffer.contents.toString())
  })
  return src
}
