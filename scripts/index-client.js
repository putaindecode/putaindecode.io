// md + assets
require.context("icons", true, /\.svg$/)
require.context("../content", true, /\.(md|html|ico|jpe?g|png|gif)$/)

// ---

import "whatwg-fetch"
import statinamicClient from "statinamic/lib/client"

import pkg from "../package.json"
import routes from "app/routes"
import store from "app/store"
import i18n from "i18n"
import contributors from "../contributors.json"

statinamicClient({
  metadata: {
    pkg,
    i18n,
    contributors: {
      ...contributors,
      getContributor: (contributor) => {
        return (
          contributors.map[contributor]
          ? contributors.map[contributor]
          : {
            login: contributor,
            name: contributor,
          }
        )
      },
    },
  },
  routes,
  store,
})

// OMG GLOBAL STYLES !
import "index.css"
