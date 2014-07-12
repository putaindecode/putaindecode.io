var cornea = require("cornea")
var smoothScroll = require("bloody-scroll")

module.exports = cornea.extend({
  element : document.body,
  initialize : function(){
    this.scrollTo()
  },
  events : [
    {
      type : "click",
      selector : ".js-ScrollTo",
      listener : "scrollTo"
    }
  ],
  scrollTo : function(eventObject, target){
    var hash = window.location.hash
    var element
    if(target) {
      hash = target.hash
      eventObject.preventDefault()
    }
    if(!hash || hash == "#") {
      return
    }
    element = document.getElementById(hash.slice(1))
    if(!element) {
      return
    }
    setTimeout(function(){
      var clientRect = element.getBoundingClientRect()
      smoothScroll(clientRect.top + window.pageYOffset, 500)
    }, 300)
  }
})
