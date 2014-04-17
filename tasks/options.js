var options = require("minimist")(process.argv.slice(2))
  , defaults = {
      plumber : true
    }
// set some defaults options depending on some flags
if(options.production) {
  defaults.plumber = false
}

options.plumber = options.plumber === undefined ? defaults.plumber : options.plumber

module.exports = options
