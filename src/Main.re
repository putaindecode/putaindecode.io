open Belt;

let markup =
  DomRe.(
    Document.getElementById("root", document)
    ->Option.map(Element.innerHTML)
    ->Option.flatMap(item => item == "" ? None : Some(item))
  );

[@bs.get]
external getInitialData: DomRe.Window.t_window => option(App.state) =
  "initialData";

let initialData = DomRe.(window->getInitialData);

let firstPath = ref(true);

module GoogleAnalytics = {
  [@bs.send]
  external set:
    (DomRe.Window.t_window, [@bs.as "set"] _, string, string) => unit =
    "ga";
  [@bs.send]
  external send: (DomRe.Window.t_window, [@bs.as "send"] _, string) => unit =
    "ga";
};

let rec render = (~url=React.Router.dangerouslyGetInitialUrl(), ()) => {
  switch (markup, firstPath^) {
  | (Some(_), true) =>
    ReactDOMRe.hydrateToElementWithId(<App url ?initialData />, "root")
  | _ => ReactDOMRe.renderToElementWithId(<App url />, "root")
  };
  let watcherId = ref(None);
  watcherId :=
    Some(
      React.Router.watchUrl(newUrl => {
        (watcherId^)
        ->Option.map(watcherId => React.Router.unwatchUrl(watcherId))
        ->ignore;
        if (url.path != newUrl.path) {
          Webapi.Dom.(Window.scrollTo(0.0, 0.0, window));
        };
        Webapi.Dom.window->GoogleAnalytics.set(
          "page",
          "/" ++ newUrl.path->List.toArray->Js.Array.joinWith("/", _),
        );
        Webapi.Dom.window->GoogleAnalytics.send("pageview");
        render(~url=newUrl, ());
      }),
    );
  firstPath := false;
};

render();
