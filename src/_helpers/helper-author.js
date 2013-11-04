(function() {
  module.exports.register = function(Handlebars, options) {
    var fs = require('fs')
    Handlebars.registerHelper("author", function(name) {
      var dataFile = "src/_members/" + name + ".json"
        , content = "<!-- no author -->"
        , template = "author"

      partial = Handlebars.partials[template]
      if (typeof partial === "string") {
        partial = Handlebars.compile(partial)
        Handlebars.partials[template] = partial
      }
      if (name) {
        if (fs.existsSync(dataFile)) {
          content = partial(
            JSON.parse(fs.readFileSync(dataFile, 'utf8'))
          )
        }
        else {
          content = "<!-- author not found -->"
        }
      }
      return new Handlebars.SafeString(content)
    })
  }
}).call(this)
