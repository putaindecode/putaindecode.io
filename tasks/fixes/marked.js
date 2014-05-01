var marked = require("marked")
  , renderer = new marked.Renderer()
  , options = require("../cache/options")

marked.setOptions({
  highlight : function(code){
    return require("highlight.js").highlightAuto(code).value;
  },
  renderer : renderer,
  smartypants : true
})

/**
 * adjust image path to have by default path from images/posts
 */
renderer.image = function(href, title, text){
  if(href.indexOf("http") !== 0) {
    href = options.value.locals.uri("images/posts/" + href, options.value.locals.page)
  }
  var output = "<img src=\"" + href + "\" alt=\"" + text + "\""
  if(title) {
    output += " title=\"" + title + "\""
  }
  output += this.options.xhtml ? "/>" : ">"
  return output
}

module.exports = marked
