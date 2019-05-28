let component = ReasonReact.statelessComponent("PageLoadingIndicator");

module Styles = {
  open Css;
  let container =
    style([
      height(`calc((`sub, 100.->vh, 130->px))),
      display(flexBox),
      justifyContent(center),
      alignItems(center),
    ]);
};

[@react.component]
let make = () =>
  ReactCompat.useRecordApi({
    ...component,
    render: _ => <div className=Styles.container> <ActivityIndicator /> </div>,
  });
