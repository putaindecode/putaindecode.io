// webpack context helps to require a bundle of files
// dynamically, based on a regex
// here we bundle all test files like the following pattern
//
// ./**/__tests__/*.js

import "./tests.html"
import "./modules/polyfills"

const context = require.context(
  ".",
  true, // **/*
  /__tests__\/.*\.(js|es)$/
)
context.keys().forEach(context)
