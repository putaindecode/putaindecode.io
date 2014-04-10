var cornea = require("cornea")
  , main = require("./main")

module.exports = cornea.extend({
  element : document.querySelector(".putainde-Post"),
  events : [
    {
      type : "mouseover",
      selector : "a[href]",
      listener : "showTooltip"
    },
    {
      type : "mouseout",
      selector : "a[href]",
      listener : "hideTooltip"
    }
  ],
  showTooltip : function(eventObject, target){
    main.fire("tooltip:show", {
      x : eventObject.clientX,
      y : eventObject.clientY - 16
    }, target.href, 1000)
  },
  hideTooltip : function(eventObject, target){
    main.fire("tooltip:hide", 0)
  }
})
