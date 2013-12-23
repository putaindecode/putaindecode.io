(function() {
  module.exports.register = function(Handlebars, options) {
    var fs = require('fs')
      , _     = require('lodash')

    /*
     * Usage: {{ include [partial] }}
     */
    Handlebars.registerHelper("include", function(template, datafile) {
      var partial = Handlebars.partials[template]
      if (typeof partial === "string") {
        partial = Handlebars.compile(partial)
        Handlebars.partials[template] = partial
      }
      if (!partial) {
        if (fs.existsSync(template)) {
          return new Handlebars.SafeString(fs.readFileSync(template))
        }
        return new Handlebars.SafeString('**' + template + '** is not a partial nor a readable file.')
      }

      var context = _.extend({}, this, JSON.parse(fs.readFileSync(datafile, 'utf8')))
      return new Handlebars.SafeString(partial(context))
    })
  }
}).call(this)
