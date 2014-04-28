var rimraf = require("rimraf")
  , paths = require("./paths")

module.exports = function(){
  rimraf.sync(paths.dist.pages)
}
