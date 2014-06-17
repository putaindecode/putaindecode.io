var tape = require("tape")
var posts = require("../../scripts/views/posts")

require("../../scripts/lib/classList")

tape("posts", function(test){
  var element = document.createElement("div")
  var postView = posts.extend({element : element})
  element.innerHTML = [
    "<div class='js-Post'>",
      "<i class='js-Tag' data-tag='1'></i>",
      "<i class='js-Tag' data-tag='2'></i>",
    "</div>",
    "<div class='js-Post'>",
      "<i class='js-Tag' data-tag='3'></i>",
      "<i class='js-Tag' data-tag='2'></i>",
    "</div>",
    "<div class='js-NoPosts'></div>"
  ].join("")

  postView.posts = [].slice.call(element.querySelectorAll(".js-Post"))
  postView.noPosts = element.querySelector(".js-NoPosts")
  postView.parsePosts()

  test.deepEqual(postView.map[0], {
    element : element.children[0],
    1 : true,
    2 : true
  }, "parses posts 1/2")

  test.deepEqual(postView.map[1], {
    element : element.children[1],
    2 : true,
    3 : true
  }, "parses posts 2/2")

  postView.updatePosts({1 : true})

  test.equal(element.children[0].classList.contains("putainde-List-item--hidden"), false)
  test.equal(element.children[1].classList.contains("putainde-List-item--hidden"), true)
  test.equal(element.children[2].classList.contains("putainde-Message--hidden"), true)

  postView.updatePosts({4 : true})

  test.equal(element.children[0].classList.contains("putainde-List-item--hidden"), true)
  test.equal(element.children[1].classList.contains("putainde-List-item--hidden"), true)
  test.equal(element.children[2].classList.contains("putainde-Message--hidden"), false)

  postView.showAll()

  test.equal(element.children[0].classList.contains("putainde-List-item--hidden"), false)
  test.equal(element.children[1].classList.contains("putainde-List-item--hidden"), false)
  test.equal(element.children[2].classList.contains("putainde-Message--hidden"), true)

  test.end()
})
