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
        render(~url=newUrl, ());
      }),
    );
  firstPath := false;
};

render();
