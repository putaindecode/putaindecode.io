var tape = require("tape")
var scroller = require("../../scripts/views/scroll")

require("../../scripts/lib/classList")

tape("scroll", function(test){

  var div = document.createElement("div")
  div.innerHTML = [
    "<div id='foo' style='margin-top:5000px;height:100px;'></div>",
    "<div id='bar' style='margin-top:5000px;height:100px;'></div>"
  ].join("")
  document.body.appendChild(div)
  window.location.hash = "#foo"
  scroller.scrollTo()
  setTimeout(function(){
    var element = document.getElementById("foo")
    test.equal(element.scrollTop, 0)

    scroller.scrollTo(
      {
        preventDefault : function(){
          test.ok(1, "prevents default")
        }
      },
      {
        hash : "#bar"
      }
    )

    setTimeout(function(){
      var element = document.getElementById("bar")
      test.equal(element.scrollTop, 0)
      test.end()
    }, 1000)

  }, 1000)
})
