module Styles = {
  open Emotion
  let container = css({
    "height": "calc(100vh - 130px)",
    "display": "flex",
    "justifyContent": "center",
    "alignItems": "center",
  })
}

@react.component
let make = () => <div className=Styles.container> <Pages.ActivityIndicator /> </div>
