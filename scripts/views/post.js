var cornea = require("cornea")

module.exports = cornea.extend({
  element : document.querySelector(".putainde-Post"),
  initialize : function(){
    this.readingTime()
  },
  readingTime : function(){
    this.elReadingTime = document.querySelector(".putainde-Post-readingTime")
    if(this.elReadingTime){
      // http://www.slate.fr/lien/57193/adulte-300-mots-minute
      // http://www.combiendemots.com/mot-par-minute
      // 250 seems cool
      this.readingTimeWpm = this.elReadingTime.getAttribute("data-readingTime-wpm") || 250
      this.elReadingTime.setAttribute("data-tip", this.elReadingTime.getAttribute("data-tip").replace("{{wpm}}", this.readingTimeWpm))
      this.elReadingTime.classList.remove("putainde-Post-readingTime--hidden")
      this.elReadingTimeValue = document.querySelector(".putainde-Post-readingTime-value")
      this.elReadingTimeReference = document.querySelector(".putainde-Post-md")
      var duration = Math.round((this.elReadingTimeReference.textContent || this.elReadingTimeReference.innerText).split(" ").length / this.readingTimeWpm)
      if(duration > 1){
        this.elReadingTimeValue.innerHTML = duration
      }
    }
  }
})
