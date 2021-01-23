{
  open Css
  global(
    "body",
    list{
      padding(zero),
      margin(zero),
      backgroundColor("fff"->hex),
      media("(prefers-color-scheme: dark)", list{backgroundColor("222"->hex)}),
      fontFamily(#custom(Theme.defaultTextFontFamily)),
      display(flexBox),
      flexDirection(column),
      minHeight(100.->vh),
      overflowX(hidden),
    },
  )
}

{
  open Css
  global("#root", list{display(flexBox), flexDirection(column), alignItems(stretch), flexGrow(1.0)})
}

{
  open Css
  global(
    "html",
    list{
      color(Theme.darkBody->hex),
      media("(prefers-color-scheme: dark)", list{color("ddd"->hex)}),
      fontSize(1.->em),
      lineHeight(#abs(1.4)),
      unsafe("WebkitFontSmoothing", "antialiased"),
      unsafe("WebkitTextSizeAdjust", "100%"),
    },
  )
}

{
  open Css
  global(
    "a",
    list{
      color(Theme.gradientRedBottom->hex),
      media("(prefers-color-scheme: dark)", list{color("ddd"->hex)}),
      textDecoration(underline),
      hover(list{textDecoration(none)}),
    },
  )
}

{
  open Css
  global("*, *:before, *:after", list{boxSizing(borderBox)})
}
