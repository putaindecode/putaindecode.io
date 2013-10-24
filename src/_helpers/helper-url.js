(function() {
  module.exports.register = function(Handlebars, options) {
    /*
     * Usage: {{ url [file] }}
     */
    Handlebars.registerHelper("url", function(file) {
      var url = file.replace(/^dist\//, '')
      url = url.replace(/index.html$/, '')
      return url
    });
  };
}).call(this)
