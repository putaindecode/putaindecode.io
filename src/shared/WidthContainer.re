let component = React.statelessComponent("WidthContainer");

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

let make = children => {
  ...component,
  render: _ => <div className=Styles.container> ...children </div>,
};
