var cornea = require("cornea")
  , tags = require("./tags")

module.exports = cornea.extend({
  element : ".js-Posts",
  initialize : function(){
    var thisValue = this
    this.posts = [].slice.call(this.element.querySelectorAll(".js-Post"))
    this.noPosts = this.element.querySelector(".js-NoPosts")
    this.parsePosts()
    tags.listen("change", function(){
      thisValue.updatePosts(tags.valueOf())
    })
  },
  map : {},
  hidden : [],
  parsePosts : function(){
    var id = -1
    this.posts.forEach(getTags, this)
    function getTags(item){
      var tags = item.querySelectorAll(".js-Tag")
        , index = -1
        , length = tags.length
      item.id = "cornea-Post--" + (++id)
      this.map[item.id] = {}
      this.map[item.id].element = item
      while(++index < length) {
        this.map[item.id][tags[index].getAttribute("data-tag")] = true
      }
    }
  },
  updatePosts : function(tags){
    var key, id, element
    this.showAll()
    for(key in tags) {
      for(id in this.map) {
        if(!this.map[id][key]) {
          element = this.map[id].element
          if(this.hidden.indexOf(element) == -1) {
            this.hidden.push(element)
            element.classList.add("putainde-List-item--hidden")
          }
        }
      }
    }
    if(this.hidden.length == this.posts.length) {
      this.noPosts.classList.remove("putainde-Message--hidden")
    }
  },
  showAll : function(){
    var item
    this.noPosts.classList.add("putainde-Message--hidden")
    while(item = this.hidden.shift()) {
      item.classList.remove("putainde-List-item--hidden")
    }
  }
})
