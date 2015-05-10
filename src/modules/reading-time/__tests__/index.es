import tape from "tape"

import readingTime from ".."

tape("reading-time", test => {
  const element = document.createElement("div")
  element.innerHTML = [
    "<span data-r-tooltip='foo {{wpm}} bar' data-readingtime-wpm='40' class='putainde-Post-readingTime putainde-Post-readingTime--hidden r-Tooltip r-Tooltip--top r-Tooltip--nowrap'>",
    "  Temps de lecture : environ ",
    "  <span class='putainde-Post-readingTime-value'></span>",
    "  minutes",
    "</span>",
  ].join("")
  const postView = readingTime.extend({
    element: element.querySelector(".putainde-Post-readingTime-value"),
  })

  const postElement = document.createElement("div")
  postElement.className = "putainde-Post-md"
  document.body.appendChild(postElement)

  postElement.innerHTML = "<b>foo</b> bar baz <strong>foo bar baz</strong>"
  test.equal(postView.getDuration(), 0, "should have no duration when just a few words")

  postElement.innerHTML = Array(500).join("a ")
  test.equal(
    postView.getDuration(),
    2,
    "should have 2min duration when just enough"
  )

  test.equal(
    postView.template().nodeType,
    3,
    "should be a node text node"
  )

  test.equal(
    postView.template().nodeValue,
    "2",
    "should have the 2min"
  )

  test.equal(
    typeof postView.wordsPerMinute,
    "number",
    "should have a default value"
  )

  postView.parseWordsPerMinute()
  test.equal(
    postView.wordsPerMinute,
    40,
    "should get a value"
  )

  element.children[0].removeAttribute("data-readingtime-wpm")
  delete postView.wordsPerMinute
  postView.parseWordsPerMinute()
  postView.show()
  test.equal(
    element.classList.contains("putainde-Post-readingTime--hidden"),
    false,
    "should be visible"
  )

  test.equal(
    postView.wordsPerMinute,
    250,
    "should ignores if no data-attribute"
  )
  postView.setTooltipWording()
  test.equal(
    element.children[0].getAttribute("data-r-tooltip"),
    "foo 250 bar",
    "should be able to set tooltip wording"
  )

  // cleanup
  document.body.removeChild(postElement)

  test.end()
})
