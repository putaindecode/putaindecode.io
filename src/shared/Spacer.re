let component = ReasonReact.statelessComponent("Spacer");

[@react.component]
let make = (~width as widthPx=10, ~height as heightPx=10, ()) =>
  ReactCompat.useRecordApi({
    ...component,
    render: _ =>
      <div
        className=Css.(
          style([width(widthPx->px), height(heightPx->px), flexShrink(0)])
        )
      />,
  });
