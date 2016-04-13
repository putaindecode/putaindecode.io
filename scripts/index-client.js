// assets
require.context("icons", true, /\.svg$/)
require.context("../content", true, /\.(html|ico|jpe?g|png|gif)$/)

// OMG GLOBAL STYLES !
import "_legacy-css/index.css"

// phenomic
import "babel-polyfill"
import "whatwg-fetch"
import phenomicClient from "phenomic/lib/client"

import metadata from "app/metadata"
import routes from "app/routes"
import store from "app/store"

phenomicClient({
  metadata,
  routes,
  store,
})

// md files → JSON && generate collection + hot loading for dev
let mdContext = require.context("../content", true, /\.md$/)
mdContext.keys().forEach(mdContext)
if (module.hot) {
  const mdHotUpdater = require("phenomic/lib/client/hot-md").default
  module.hot.accept(mdContext.id, () => {
    mdContext = require.context("../content", true, /\.md$/)
    const requireUpdate = mdHotUpdater(mdContext, window.__COLLECTION__, store)
    mdContext.keys().forEach(requireUpdate)
  })
}
