var marked = require("marked")
var renderer = new marked.Renderer()
var options = require("../cache/options")
var accents = {
  "é" : "e",
  "è" : "e",
  "ê" : "e",
  "à" : "a",
  "ù" : "u",
  "ô" : "o"
}
var accentsRE = RegExp("(" + Object.keys(accents).join("|") + ")", "g")

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

renderer.heading = function(text, level){
  var escaped = text.toLowerCase()
    .replace(accentsRE, function(i){
      return accents[i]
    })
    .replace(/\W+/g, "-")

  return "<h" + level + " id=\"" + escaped + "\">" +
    "<a class=\"putainde-Title-anchor\" href=\"#" + escaped + "\">#</a>" +
    text + "</h" + level + ">"
}

module.exports = marked
