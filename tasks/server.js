var path = require("path")
var cwd = path.join(process.cwd(), "dist") + path.sep

var util = require("gulp-util")

var livereloadServer
var ports = {
  web : 4242,
  livereload : 4243
}

var paths = require("./paths")

module.exports = {
  /**
   * start a dev server (connect + livereload) & open it
   * Options accept the following:
   *   livereload: true|false|Integer (enable|disable|port to enable) (default to true - see port defined above)
   *   connect: true|false|Integer (enable|disable|port to enable) (default to true - see port defined above)
   *   open: true|false|url (open|don't open|url to open) (default to connect url)
   *
   * @param  {Object} options (optional)
   * @param  {Function} cb Callback called when server is started (optional)
   * @return {void}
   */
  start : function(options, cb){
    if(cb === undefined){
      cb = options
      options = {}
    }
    options.livereload = (options.livereload !== undefined ? options.livereload : true)
    options.connect = (options.connect !== undefined ? options.connect : true)
    options.open = (options.open !== undefined ? options.open : "http://localhost:" + ports.web)

    if(options.livereload){
      // assume integer, so a port
      if(options.livereload !== true){
        ports.livereload = options.livereload
      }

      livereloadServer = require("tiny-lr")()
      livereloadServer.listen(ports.livereload, function(){
        util.log("Started livereload server on http://localhost:" + ports.livereload)
      })
    }

    if(options.connect){
      if(options.connect !== true){
        // assume integer, so a port
        ports.connect = options.connect
      }

      var connect = require("connect")

      require("http")
        .createServer(
          connect()
            .use(require("connect-livereload")({port : ports.livereload}))
            .use(require("serve-static")(paths.dist.public))
        )
        .listen(ports.web)
        .on("listening", function(){
          util.log("Started connect web server on http://localhost:" + ports.web)
        })
    }

    if(options.open){
      require("opn")(options.open)
    }

    if(cb){
      cb()
    }
  },

  /**
   * callback to pass to gulp-watch
   *
   * @param  {Object} file file object that contain type of the update & the path
   * @return {void}
   */
  livereload : function(file){
    // var filePath = file ? file.hasOwnProperty("path") ? file.path : file : "*";
    util.log("Reloading (" + file.type + ")", file.path.replace(cwd, ""))
    livereloadServer.changed({body : {files : [file.path]}})
  }
}
