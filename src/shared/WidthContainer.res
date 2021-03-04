module Styles = {
  open Css
  let safeArea = style(list{
    unsafe("paddingLeft", "env(safe-area-inset-left)"),
    unsafe("paddingRight", "env(safe-area-inset-right)"),
  })
  let container = style(list{
    width(100.->pct),
    maxWidth(1024->px),
    margin2(~h=auto, ~v=zero),
    padding2(~h=10->px, ~v=zero),
    flexGrow(1.),
    display(flexBox),
    flexDirection(column),
    alignItems(stretch),
  })
}

@react.component
let make = (~children, ()) =>
  <div className=Styles.safeArea> <div className=Styles.container> children </div> </div>
