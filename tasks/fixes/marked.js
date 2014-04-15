var marked = require("marked")
  , renderer = new marked.Renderer()
  , options = require("../cache/options")

marked.setOptions({
  highlight : function(code){
    return require("highlight.js").highlightAuto(code).value;
  },
  renderer : renderer
})

renderer.image = function(href, title, text){
  if(href.indexOf("http") !== 0) {
    href = options.value.locals.path.relative(options.value.locals.page, "images/posts/" + href)
  }
  var output = "<img src=\"" + href + "\" alt=\"" + text + "\""
  if(title) {
    output += " title=\"" + title + "\""
  }
  output += this.options.xhtml ? "/>" : ">"
  return output
}

module.exports = marked
