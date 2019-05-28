let component = ReasonReact.statelessComponent("WidthContainer");

module Styles = {
  open Css;
  let container =
    style([
      width(100.->pct),
      maxWidth(1024->px),
      margin2(~h=auto, ~v=zero),
      padding2(~h=10->px, ~v=zero),
      flexGrow(1.),
      display(flexBox),
      flexDirection(column),
      alignItems(stretch),
    ]);
};

[@react.component]
let make = (~children, ()) => {
  let children = React.Children.toArray(children);
  ReactCompat.useRecordApi({
    ...component,
    render: _ => <div className=Styles.container> children->React.array </div>,
  });
};
