var cornea = require("cornea")
  , curry = require("bloody-curry")

module.exports = cornea.extend({
  element : document.documentElement,
  initialize : function(){
    var images = this.element.querySelectorAll(".js-AnimateLoad")
    ;[].forEach.call(images, curry(this.addLoadedClass)(null))
  },
  events : [
    {
      type : "load",
      selector : ".js-AnimateLoad",
      capture : true,
      listener : "addLoadedClass"
    }
  ],
  addLoadedClass : function(eventObject, target){
    var classList = target.classList
    if(!target.complete) return
    classList.remove("js-AnimateLoad")
    classList.add("js-Loaded")
  }
})
