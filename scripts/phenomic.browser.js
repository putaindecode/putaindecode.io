// Hot loading HRM Patch
import "react-hot-loader/patch";

// assets
// require.context("../src/icons", true, /\.svg$/)
require.context("../content", true, /\.(html|json|txt|ico|jpe?g|png|gif)$/);

// OMG GLOBAL STYLES !
import "../src/_legacy-css/index.css";

// phenomic
import "babel-polyfill";
import "whatwg-fetch";

import metadata from "../src/metadata.js";
import routes from "../src/routes.js";
import store from "../src/store.js";
import phenomicClient from "phenomic/lib/client";

phenomicClient({ metadata, routes, store });

// md files processed via phenomic-loader to JSON & generate collection
let mdContext = require.context("../content", true, /\.md$/);
mdContext.keys().forEach(mdContext);

// hot loading
if (module.hot) {
  // hot load md
  module.hot.accept(mdContext.id, () => {
    mdContext = require.context("../content", true, /\.md$/);
    const mdHotUpdater = require("phenomic/lib/client/hot-md").default;
    const requireUpdate = mdHotUpdater(mdContext, window.__COLLECTION__, store);
    mdContext.keys().forEach(requireUpdate);
  });

  // hot load app
  module.hot.accept(
    ["../src/metadata.js", "../src/routes.js", "../src/store.js"],
    () =>
      phenomicClient({
        metadata: require("../src/metadata.js").default,
        routes: require("../src/routes.js").default,
        store: require("../src/store.js").default,
      }),
  );
}
