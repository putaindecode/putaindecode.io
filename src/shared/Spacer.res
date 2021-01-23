@react.component
let make = (~width as widthPx=10, ~height as heightPx=10, ()) =>
  <div
    className={
      open Css
      style(list{width(widthPx->px), height(heightPx->px), flexShrink(0.0)})
    }
  />
