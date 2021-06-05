let reset: string => unit = %raw(`
  function(url) {
DISQUS.reset({
  reload: true,
  config: function config() {
    this.page.identifier = url
    this.page.url = url + '#!newthread';
  }
})}
`)

let init: string => unit = %raw(`function (url) {
window.disqus_config = function() {
  this.page.identifier = url;
  this.page.url = url;
}}
`)

let loadDisqus = url => {
  if %raw(`typeof DISQUS != "undefined"`) {
    reset(url)
  } else {
    let script = document["createElement"](. "script")
    init(url)
    let () = script["src"] = "https://putaindecode.disqus.com/embed.js"
    let () = script["setAttribute"](. "data-timestamp", Date.now()->String.make)
    let () = script["defer"] = 1
    switch document["querySelector"](. "script")->Nullable.toOption {
    | Some(firstScript) => firstScript["parentNode"]["insertBefore"](. script, firstScript)
    | None => ()
    }
  }
}

module Styles = {
  open Emotion
  let disqus = css({
    "maxWidth": 640,
    "width": "100%",
    "margin": "0 auto",
    "padding": "20px 0",
  })
}

@react.component
let make = (~url, ()) => {
  React.useEffect0(() => {
    let timeoutId = setTimeout(() => loadDisqus(url), 1_000)
    Some(() => clearTimeout(timeoutId))
  })

  <div id="disqus_thread" className=Styles.disqus />
}
