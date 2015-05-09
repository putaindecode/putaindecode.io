// webpack context helps to require a bundle of files
// dynamically, based on a regex
// here we bundle all test files like the following pattern
//
// ./(src|modules)/**/__tests__/*.js
//
var context = require.context(
  ".",
  true, // **/*
  /__tests__\/.*\.js$/
)
context.keys().forEach(context)

// var contextComponents = require.context(
//   "./modules",
//   true, // **/*
//   /__tests__\/.*\.js$/
// )
// contextComponents.keys().forEach(contextComponents)
