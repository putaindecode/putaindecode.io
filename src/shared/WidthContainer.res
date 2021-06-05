module Styles = {
  open Emotion
  let safeArea = css({
    "paddingLeft": "env(safe-area-inset-left)",
    "paddingRight": "env(safe-area-inset-right)",
  })
  let container = css({
    "width": "100%",
    "maxWidth": 1024,
    "margin": "0 auto",
    "padding": "0 10px",
    "flexGrow": 1.0,
    "display": "flex",
    "flexDirection": "column",
    "alignItems": "stretch",
  })
}

@react.component
let make = (~children, ()) =>
  <div className=Styles.safeArea> <div className=Styles.container> children </div> </div>
