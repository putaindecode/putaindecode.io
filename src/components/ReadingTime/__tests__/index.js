import tape from "tape";
import React from "react";

import ReadingTime from "..";

tape("ReadingTime", t => {
  const oneMinute = React.renderToStaticMarkup(
    <ReadingTime text={"one ".repeat(200)} template="${value}" />
  );

  t.ok(
    oneMinute.indexOf(">less than a minute<") > -1,
    "should say when you have less than a minute"
  );

  t.ok(
    oneMinute.indexOf(
      `data-r-tooltip=` +
        `"Approxiate time, based on a speed of 250 words per minute"`
    ) > -1,
    "should offer a tooltip as attribute"
  );

  t.ok(
    oneMinute.indexOf(`class="r-Tooltip r-Tooltip--top"`) > -1,
    "should use cssrecipes-tooltip"
  );

  const twoMinutes = React.renderToStaticMarkup(
    <ReadingTime text={"one ".repeat(300)} template="${value}" />
  );

  t.ok(
    twoMinutes.indexOf(">around 2 minutes<") > -1,
    "should say when you have more than one minute"
  );

  const tenMinutes = React.renderToStaticMarkup(
    <ReadingTime text={"one ".repeat(2500)} template="${value}" />
  );

  t.ok(
    tenMinutes.indexOf(">around 10 minutes<") > -1,
    "should say when you have 10 minutes"
  );

  t.end();
});
