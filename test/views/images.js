var tape = require("tape")
  , images = require("../../scripts/views/images")

require("./lib/classList")

tape("images view", function(test){

  var img = document.createElement("img")
    , div = document.createElement("div")
  images.addLoadedClass(null, div)
  test.equal(div.classList.contains("js-Loaded"), false)
  img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
  img.onload = function(){
    images.addLoadedClass(null, img)
    test.equal(img.classList.contains("js-Loaded"), true)
    test.end()
  }

})
