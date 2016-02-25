import statinamicStatic from "statinamic/lib/static"

import routes from "app/routes"
import store from "app/store"

import metadata from "./metadata"

module.exports = ({
  urls,
  pagesData,
  dest,
  baseUrl,
}) => (
  statinamicStatic({
    metadata,
    urls,
    pagesData,
    dest,
    baseUrl,
    routes,
    store,
  })
)
