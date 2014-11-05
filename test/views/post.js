var tape = require("tape")
var post = require("../../src/scripts/views/post")

require("../../src/scripts/lib/classList")

tape("post", function(test){
  var element = document.createElement("div")
  element.innerHTML = [
    "<span data-cssr-tooltip='foo {{wpm}} bar' data-readingtime-wpm='40' class='putainde-Post-readingTime putainde-Post-readingTime--hidden cssr-Tooltip cssr-Tooltip--top cssr-Tooltip--nowrap'>",
    "  Temps de lecture : environ ",
    "  <span class='putainde-Post-readingTime-value'></span>",
    "  minutes",
    "</span>"
  ].join("")
  var postView = post.extend({
    element : element.querySelector(".putainde-Post-readingTime-value")
  })

  var postElement = document.createElement("div")
  postElement.className = "putainde-Post-md"
  document.body.appendChild(postElement)

  postElement.innerHTML = "<b>foo</b> bar baz <strong>foo bar baz</strong>"
  test.equal(postView.getDuration(), 0)
  postElement.innerHTML = Array(500).join("a ")
  test.equal(postView.getDuration(), 2)

  test.equal(postView.template().nodeType, 3)
  test.equal(postView.template().nodeValue, "2")
  test.equal(typeof postView.wordsPerMinute, "number", "has a default value")
  postView.parseWordsPerMinute()
  test.equal(postView.wordsPerMinute, 40, "gets value")
  element.children[0].removeAttribute("data-readingTime-wpm")
  delete postView.wordsPerMinute
  postView.parseWordsPerMinute()
  postView.show()
  test.equal(
    element.classList.contains("putainde-Post-readingTime--hidden"),
    false
  )
  test.equal(postView.wordsPerMinute, 250, "ignores if no data-attribute")
  postView.setTooltipWording()
  test.equal(element.children[0].getAttribute("data-cssr-tooltip"), "foo 250 bar")
  test.end()
})
