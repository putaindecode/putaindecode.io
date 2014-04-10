var cornea = require("cornea")
  , main = require("./main")

function toPx(number){
  return String(parseInt(number, 10)) + "px"
}

module.exports = cornea.extend({
  element : document.createElement("div"),
  initialize : function(){
    this.element.classList.add("putainde-Tooltip")
    document.body.appendChild(this.element)
    main.listen("tooltip:show", this.show.bind(this))
    main.listen("tooltip:hide", this.hide.bind(this))
  },
  timeout: null,
  data: {
    value : ""
  },
  show : function(coords, content, delay){
    var size, thisValue = this
    if(this.timeout) {
      clearTimeout(this.timeout)
    }
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
  hide : function(delay){
    var classList = this.element.classList
    if(this.timeout) {
      return
    }
    this.timeout = setTimeout(function(){
      classList.remove("putainde-Tooltip--visible")
    }, delay || 0)
  }
})
