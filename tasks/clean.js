var rimraf = require("rimraf")
var paths = require("./paths")

module.exports = function(){
  rimraf.sync(paths.tmp)
  rimraf.sync(paths.dist.public)
}
