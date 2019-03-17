let component = React.statelessComponent("Spacer");

let make = (~width as widthPx=10, ~height as heightPx=10, _) => {
  ...component,
  render: _ =>
    <div
      className=Css.(
        style([width(widthPx->px), height(heightPx->px), flexShrink(0)])
      )
    />,
};
