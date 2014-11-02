var tape = require("tape")
var tagFilters = require("../../src/scripts/views/tagfilters")

require("../../src/scripts/lib/classList")

tape("tagfilters", function(test){

  var tag = tagFilters.create()
  var body = document.body

  tag.toggleFilters()
  test.equal(body.classList.contains("putainde-Body--tagFiltersOpened"), true)
  tag.closeFilters()
  test.equal(body.classList.contains("putainde-Body--tagFiltersOpened"), false)
  tag.toggleFilters()
  test.equal(body.classList.contains("putainde-Body--tagFiltersOpened"), true)
  test.end()

})
