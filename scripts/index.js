var domReady = require("bloody-domready")

require("./lib/classList")

domReady(function(){
  require("./views/images").create()
  require("./views/column").create()
  require("./views/post").create()
  require("./views/posts").create()
  require("./views/tagfilters").create()
  require("./views/scroll").create()
})
