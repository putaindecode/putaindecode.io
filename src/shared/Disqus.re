open Belt;

let reset: option(string) => unit = [%bs.raw
  url => {|
DISQUS.reset({
  reload: true,
  config: function config() {
    this.page.identifier = url ? "http://putaindecode.io/fr/articles/" + url + "/" : window.location.toString();
    this.page.url = (url ? "http://putaindecode.io/fr/articles/" + url + "/" : window.location.toString()) + '#!newthread';
  }
})
|}
];

let init: option(string) => unit = [%bs.raw
  url => {|
window.disqus_config = function() {
  this.page.identifier = (url ? "http://putaindecode.io/fr/articles/" + url + "/" : window.location.toString());
  this.page.url = (url ? "http://putaindecode.io/fr/articles/" + url + "/" : window.location.toString());
};
|}
];

let loadDisqus = url => {
  Webapi.(
    if ([%bs.raw {|typeof DISQUS != "undefined"|}]) {
      reset(url);
    } else {
      let script = Dom.Document.createElement("script", Dom.document);
      init(url);
      Dom.Element.setAttribute(
        "src",
        "https://putaindecode.disqus.com/embed.js",
        script,
      );
      Dom.Element.setAttribute(
        "data-timestamp",
        Js.Date.now()->Js.String.make,
        script,
      );
      Dom.Element.setAttribute("defer", "defer", script);
      Dom.Document.querySelector("script", Dom.document)
      ->Option.map(firstScript =>
          firstScript
          ->Dom.Element.parentElement
          ->Option.map(parent =>
              Dom.Element.insertBefore(script, firstScript, parent)
            )
          ->ignore
        )
      ->ignore;
    }
  );
};

let component = ReasonReact.statelessComponent("Disqus");

module Styles = {
  open Css;
  let disqus =
    style([
      maxWidth(640->px),
      width(100.->pct),
      margin2(~h=auto, ~v=zero),
      padding2(~v=20->px, ~h=zero),
    ]);
};

[@react.component]
let make = (~url=?, ()) =>
  ReactCompat.useRecordApi({
    ...component,
    didMount: _ => {
      Js.Global.setTimeout(() => loadDisqus(url), 1_000)->ignore;
    },
    render: _ => {
      <div id="disqus_thread" className=Styles.disqus />;
    },
  });
