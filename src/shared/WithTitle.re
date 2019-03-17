type state = string;

type action = unit;

open Belt;

let component = React.reducerComponent("WithTitle");

let suffix = title =>
  title == "Putain de code" ? title : title ++ " | Putain de code";

let make = (~title, children) => {
  ...component,
  initialState: () => title,
  didMount: _ => Seo.set(~title=title->suffix, ()),
  reducer: ((), _) => React.NoUpdate,
  willReceiveProps: ({state}) => {
    if (state != title) {
      Seo.set(~title=title->suffix, ());
    };
    title;
  },
  render: _ => children[0]->Option.getWithDefault(React.null),
};
