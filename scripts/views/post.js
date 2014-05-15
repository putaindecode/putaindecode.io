var cornea = require("cornea")

module.exports = cornea.extend({
  element : ".putainde-Post-readingTime-value",
  initialize : function(){
    this.parseWordsPerMinute()
    this.setTooltipWording()
    this.render()
    this.show()
  },
  setTooltipWording : function(){
    var element = this.element.parentNode
    var tipContents = element.getAttribute("data-tip")
    element.setAttribute(
      "data-tip",
      tipContents.replace("{{wpm}}", this.wordsPerMinute)
    )
  },
  // http://www.slate.fr/lien/57193/adulte-300-mots-minute
  // http://www.combiendemots.com/mot-par-minute
  // 250 seems cool
  wordsPerMinute : 250,
  parseWordsPerMinute : function(){
    var dataAttribute = "data-readingTime-wpm"
    var element = this.element.parentNode
    if(element.hasAttribute(dataAttribute)) {
      this.wordsPerMinute = parseInt(
        element.getAttribute(dataAttribute),
        10
      )
    }
  },
  getDuration : function(){
    var post = document.querySelector(".putainde-Post-md")
    var text = post.textContent || post.innerText
  console.log(text, text.split(/\s+|\s*\.\s*/))
    return Math.round(text.split(/\s+|\s*\.\s*/).length / this.wordsPerMinute)
  },
  template : function(){
    return document.createTextNode(this.getDuration())
  },
  show : function(){
    var element = this.element.parentNode
    element.classList.remove("putainde-Post-readingTime--hidden")
  }
})
