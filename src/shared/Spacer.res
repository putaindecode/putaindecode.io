@react.component
let make = (~width=10, ~height=10, ()) =>
  <div
    className={
      open Emotion
      css({"width": width, "height": height, "flexShrink": 0.0})
    }
  />
