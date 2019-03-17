let createEmotion =
  require("create-emotion").default || require("create-emotion");

let context = typeof global !== "undefined" ? global : {};

module.exports = createEmotion(context, { key: "putaindecss" });
