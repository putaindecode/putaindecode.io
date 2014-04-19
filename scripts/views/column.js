var cornea = require("cornea")
  , tags = require("../models/tags")

module.exports = cornea.extend({
  element : ".js-Column",
  events : [
    {
      type : "change",
      selector : ".js-ToggleTag",
      listener : "updateTags"
    }
  ],
  updateTags : function(eventObject, target){
    if(target.checked) {
      tags.set(target.value, true)
      return
    }
    tags.remove(target.value)
  }
})
