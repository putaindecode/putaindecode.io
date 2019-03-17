type t;

type config = {
  .
  "title": string,
  "description": string,
  "feed_url": string,
  "site_url": string,
};

[@bs.new] [@bs.module] external make: config => t = "rss";

type itemConfig = {
  .
  "title": string,
  "description": string,
  "url": string,
  "guid": string,
};

[@bs.send] external item: (t, itemConfig) => unit = "item";

[@bs.send] external toXml: t => string = "xml";
