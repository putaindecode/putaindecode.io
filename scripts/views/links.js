var cornea = require("cornea")
  , app = require("../app")

module.exports = cornea.extend({
  element : ".putainde-Post",
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
    app.fire("tooltip:show", {
      x : eventObject.clientX,
      y : eventObject.clientY - 16
    }, target.href, 1000)
  },
  hideTooltip : function(eventObject, target){
    app.fire("tooltip:hide")
  }
})
