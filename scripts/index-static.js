import statinamicStatic from "statinamic/lib/static"

import routes from "app/routes"
import store from "app/store"

import metadata from "./metadata"

export default ({
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
