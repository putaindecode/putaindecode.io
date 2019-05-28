type state = string;

type action = unit;

open Belt;

let component = ReasonReact.reducerComponent("WithTitle");

let suffix = title =>
  title == "Putain de code" ? title : title ++ " | Putain de code";

[@react.component]
let make = (~title, ~children, ()) => {
  let children = React.Children.toArray(children);
  ReactCompat.useRecordApi({
    ...component,
    initialState: () => title,
    didMount: _ => Seo.set(~title=title->suffix, ()),
    reducer: ((), _) => ReasonReact.NoUpdate,
    willReceiveProps: ({state}) => {
      if (state != title) {
        Seo.set(~title=title->suffix, ());
      };
      title;
    },
    render: _ => children[0]->Option.getWithDefault(ReasonReact.null),
  });
};
