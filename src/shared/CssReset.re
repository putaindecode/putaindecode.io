Css.(
  global(
    "body",
    [
      padding(zero),
      margin(zero),
      backgroundColor("fff"->hex),
      media("(prefers-color-scheme: dark)", [backgroundColor("222"->hex)]),
      Theme.defaultTextFontFamily->fontFamily,
      display(flexBox),
      flexDirection(column),
      minHeight(100.->vh),
      overflowX(hidden),
    ],
  )
);

Css.(
  global(
    "#root",
    [
      display(flexBox),
      flexDirection(column),
      alignItems(stretch),
      flexGrow(1.0),
    ],
  )
);

Css.(
  global(
    "html",
    [
      color(Theme.darkBody->hex),
      media("(prefers-color-scheme: dark)", [color("ddd"->hex)]),
      fontSize(1.->em),
      lineHeight(`abs(1.4)),
      `declaration(("WebkitFontSmoothing", "antialiased")),
      `declaration(("WebkitTextSizeAdjust", "100%")),
    ],
  )
);

Css.(
  global(
    "a",
    [
      color(Theme.gradientRedBottom->hex),
      textDecoration(underline),
      hover([textDecoration(none)]),
    ],
  )
);

Css.(global("*, *:before, *:after", [boxSizing(borderBox)]));
