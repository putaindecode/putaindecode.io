// md + assets
require.context("icons", true, /\.svg$/)
require.context("../content", true, /\.(md|html|ico|jpe?g|png|gif)$/)

// ---

import "whatwg-fetch"
import statinamicClient from "statinamic/lib/client"

import routes from "app/routes"
import store from "app/store"

import metadata from "./metadata"

statinamicClient({
  metadata,
  routes,
  store,
})

// OMG GLOBAL STYLES !
import "index.css"
