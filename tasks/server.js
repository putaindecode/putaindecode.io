var gulpUtil = require("gulp-util")
  , ports = {
    web : 4242,
    livereload : 4243
  }
  , connect = require("connect")
  , connectLivereload = require("connect-livereload")
  , livereload = require("gulp-livereload")
  , livereloadServer
  , opn = require("opn")
  , paths = require("./paths")

/**
 * task that generate a static web server with livereload
 *
 * used for local development only
 */
module.exports = {
  start : function(){
    livereloadServer = livereload(ports.livereload)

    var app = connect()
      .use(connectLivereload({port : ports.livereload}))
      .use(connect.static(paths.dist.public))

    require("http").createServer(app)
      .listen(ports.web)
      .on("listening", function(){
        gulpUtil.log("Started connect web server on http://localhost:" + ports.web + " and livereload server on http://localhost:" + ports.livereload)
      })

    opn("http://localhost:" + ports.web)
  },
  livereload : function(file){
    livereloadServer.changed(file.path)
  }
}
