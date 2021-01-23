open Belt

let reset: string => unit = %bs.raw(
  `
  function(url) {
DISQUS.reset({
  reload: true,
  config: function config() {
    this.page.identifier = url
    this.page.url = url + '#!newthread';
  }
})}
`
)

let init: string => unit = %bs.raw(
  `function (url) {
window.disqus_config = function() {
  this.page.identifier = url;
  this.page.url = url;
}}
`
)

let loadDisqus = url => {
  open Webapi
  if %bs.raw(`typeof DISQUS != "undefined"`) {
    reset(url)
  } else {
    let script = Dom.Document.createElement("script", Dom.document)
    init(url)
    Dom.Element.setAttribute("src", "https://putaindecode.disqus.com/embed.js", script)
    Dom.Element.setAttribute("data-timestamp", Js.Date.now()->Js.String.make, script)
    Dom.Element.setAttribute("defer", "defer", script)
    Dom.Document.querySelector("script", Dom.document)
    ->Option.map(firstScript =>
      firstScript
      ->Dom.Element.parentElement
      ->Option.map(parent => Dom.Element.insertBefore(script, firstScript, parent))
      ->ignore
    )
    ->ignore
  }
}

module Styles = {
  open Css
  let disqus = style(list{
    maxWidth(640->px),
    width(100.->pct),
    margin2(~h=auto, ~v=zero),
    padding2(~v=20->px, ~h=zero),
  })
}

@react.component
let make = (~url, ()) => {
  React.useEffect0(() => {
    let timeoutId = Js.Global.setTimeout(() => loadDisqus(url), 1_000)
    Some(() => Js.Global.clearTimeout(timeoutId))
  })

  <div id="disqus_thread" className=Styles.disqus />
}
