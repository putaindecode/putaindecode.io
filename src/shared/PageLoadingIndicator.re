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
  <div className=Styles.container> <Pages.ActivityIndicator /> </div>;
