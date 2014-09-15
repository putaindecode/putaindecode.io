var marked = require("marked")
var renderer = new marked.Renderer()
var accents = {
  "à" : "a",
  "á" : "a",
  "â" : "a",
  "ã" : "a",
  "ä" : "a",
  "å" : "a",
  "æ" : "ae",
  "ç" : "c",
  "è" : "e",
  "é" : "e",
  "ê" : "e",
  "ë" : "e",
  "ì" : "i",
  "í" : "i",
  "î" : "i",
  "ï" : "i",
  "ñ" : "n",
  "ò" : "o",
  "ó" : "o",
  "ô" : "o",
  "õ" : "o",
  "ö" : "o",
  "ø" : "o",
  "ù" : "u",
  "ú" : "u",
  "û" : "u",
  "ü" : "u",
  "ý" : "y"
}
var accentsRE = RegExp("(" + Object.keys(accents).join("|") + ")", "g")

marked.setOptions({
  highlight : function(code){
    return require("highlight.js").highlightAuto(code).value;
  },
  renderer : renderer,
  smartypants : true
})

renderer.heading = function(text, level){
  var escaped = text.toLowerCase()
    .replace(accentsRE, function(i){
      return accents[i]
    })
    .replace(/(<\/?a[^>]*>)/ig, "") // strip html links in anchors
    .replace(/\W+/g, "-")

  return "<h" + level + " id=\"" + escaped + "\">" +
    "<a class=\"putainde-Title-anchor\" href=\"#" + escaped + "\">#</a>" +
    text + "</h" + level + ">"
}

module.exports = marked
