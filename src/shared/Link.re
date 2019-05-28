open Belt;

let component = ReasonReact.statelessComponent("Link");

let externalLinkRe = [%re "/^https?:\\/\\//"];

[@react.component]
let make =
    (
      ~url=?,
      ~href,
      ~className=?,
      ~style=?,
      ~activeClassName=?,
      ~matchSubroutes=false,
      ~onClick=?,
      ~children,
      (),
    ) => {
  let children = React.Children.toArray(children);
  ReactCompat.useRecordApi({
    ...component,
    render: _ => {
      let isActive =
        url
        ->Option.map(url =>
            "/" ++ String.concat("/", url.ReasonReact.Router.path)
          )
        ->Option.map(path =>
            matchSubroutes
              ? Js.String.startsWith(href, path ++ "/")
                || Js.String.startsWith(href, path)
              : path === href || path ++ "/" === href
          )
        ->Option.getWithDefault(false);
      let className =
        switch (className, activeClassName) {
        | (Some(className), Some(activeClassName)) when isActive =>
          Some(Css.merge([className, activeClassName]))
        | (None, Some(activeClassName)) when isActive =>
          Some(activeClassName)
        | (Some(className), _) => Some(className)
        | _ => None
        };
      <a
        href
        ?style
        onClick={event =>
          switch (
            ReactEvent.Mouse.metaKey(event),
            ReactEvent.Mouse.ctrlKey(event),
          ) {
          | (false, false) =>
            if (!externalLinkRe->Js.Re.test_(href)) {
              ReactEvent.Mouse.preventDefault(event);
              ReasonReact.Router.push(href);
            };
            switch (onClick) {
            | Some(onClick) => onClick(event)
            | None => ()
            };
          | _ => ()
          }
        }
        ?className>
        children->React.array
      </a>;
    },
  });
};
