// md + assets
require.context("icons", true, /\.svg$/)
require.context("../content", true, /\.(md|html|ico|jpe?g|png|gif)$/)

// OMG GLOBAL STYLES !
import "_legacy-css/index.css"

// statinamic
import "babel-polyfill"
import "whatwg-fetch"
import statinamicClient from "statinamic/lib/client"

import * as layouts from "layouts"
import metadata from "app/metadata"
import routes from "app/routes"
import store from "app/store"

statinamicClient({
  layouts,
  metadata,
  routes,
  store,
})
