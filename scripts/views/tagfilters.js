var cornea = require("cornea")

module.exports = cornea.extend({
  element : document.body,
  events : [
    {
      type : "click",
      selector : ".js-ToggleFilters",
      listener : "toggleFilters"
    },
    {
      type : "click",
      selector : ".js-CloseFilters",
      listener : "closeFilters"
    }
  ],
  toggleFilters : function(){
    this.element.classList.toggle("putainde-Body--tagFiltersOpened")
  },
  closeFilters : function(){
    this.element.classList.remove("putainde-Body--tagFiltersOpened")
  }
})
