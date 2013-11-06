module.exports.register = function (Handlebars, options, params) {
  'use strict';

  var opts     = options
  var _        = require('lodash')

  Handlebars.registerHelper("handlebarsception", function(options) {
    var source = options.fn(this)
    var template = Handlebars.compile(source)
    var context = _.extend({}, this, opts.data, options.hash)
    return new Handlebars.SafeString(template(context))
  })
}
