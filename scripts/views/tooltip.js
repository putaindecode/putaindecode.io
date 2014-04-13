var cornea = require("cornea")
  , app = require("../app")

function toPx(number){
  return String(parseInt(number, 10)) + "px"
}

module.exports = cornea.extend({
  element : document.createElement("div"),
  initialize : function(){
    this.element.classList.add("putainde-Tooltip")
    document.body.appendChild(this.element)
    app.listen("tooltip:show", this.show.bind(this))
    app.listen("tooltip:hide", this.hide.bind(this))
  },
  timeout: null,
  data: {
    value : ""
  },
  show : function(coords, content, delay){
    var size
      , thisValue = this
    this.timeout = setTimeout(function(){
      thisValue.timeout = null
      thisValue.data.value = content
      thisValue.render()
      size = thisValue.element.getBoundingClientRect()
      thisValue.element.style.top = toPx((coords.y + window.pageYOffset) - (size.bottom  - size.top))
      thisValue.element.style.left = toPx(coords.x + window.pageXOffset)
      thisValue.element.classList.add("putainde-Tooltip--visible")
    }, delay || 0)
  },
  template : function(data){
    var span = document.createElement("span")
      , icon = document.createElement("i")
    icon.classList.add("putainde-Icon")
    icon.classList.add("putainde-Icon--world")
    span.appendChild(icon)
    span.appendChild(document.createTextNode(String(data.value)))
    return span
  },
  hide : function(){
    if(this.timeout) {
      clearTimeout(this.timeout)
    }
    this.element.classList.remove("putainde-Tooltip--visible")
  }
})
