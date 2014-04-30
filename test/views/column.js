var tape = require("tape")
  , column = require("../../scripts/views/column")
  , tags = require("../../scripts/models/tags")

require("../../scripts/lib/classList")

tape("column view", function(test){

  column.updateTags(null, {
    checked : true,
    value : "1"
  })

  test.equal(tags.get("1"), true, "adds")

  column.updateTags(null, {
    checked : false,
    value : "1"
  })

  test.equal(tags.get("1"), void 0, "removes")
  test.equal(1 in tags.valueOf(), false, "removes using delete")
  test.end()

})
