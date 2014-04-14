var tape = require("tape")
  , scroll = require("../../scripts/views/scroll")

tape("scroll", function(test){

  var div = document.createElement("div")
  div.innerHTML = [
    "<div id='foo' style='margin-top:5000px;height:100px;'></div>",
    "<div id='bar' style='margin-top:5000px;height:100px;'></div>"
  ].join("")
  document.body.appendChild(div)
  window.location.hash = "#foo"
  scroll.scrollTo()
  setTimeout(function(){
    var element = document.getElementById("foo")
    test.equal(element.scrollTop, 0)

    scroll.scrollTo(
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
      test.equal(bar.scrollTop, 0)
      test.end()
    }, 1000)

  }, 1000)
})
