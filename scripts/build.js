import builder from "phenomic/lib/builder"

import config from "./config.js"

import store from "../web_modules/app/store"
const exports = {
  metadata: require.resolve("../web_modules/app/metadata"),
  routes: require.resolve("../web_modules/app/routes"),
}

builder({
  config,
  exports,
  store,
})
