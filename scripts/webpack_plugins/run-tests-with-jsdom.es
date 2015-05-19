import jsdom from "jsdom"

export default function runTestsWithJSDOM(options = {}) {
  if (!options.url) {
    throw new Error("Expect an `url` option (string)")
  }

  if (!options.compiledAssetsSources) {
    throw new Error(
      "Expect an `compiledAssetsSources` option (array of string)"
    )
  }

  function getCompilationAssets(stats) {
    return options.compiledAssetsSources.map(entry => {
      if (!stats.compilation.assets[entry]) {
        throw new Error(`Missing entry ${entry} to run tests with jsdom`)
      }

      return stats.compilation.assets[entry]._cachedSource
    })
  }

  return function() {
    let previousWindow = null
    this.plugin("invalid", () => {
      if (previousWindow) {
        previousWindow.close()
      }
    })
    this.plugin("done", (stats) => {
      const virtualConsole = jsdom.createVirtualConsole()
      virtualConsole.sendTo(console)

      // @todo we might want to colorize the output and do more fancy stuff ?
      // virtualConsole.on("log", function (message) {
      //   let enhancedMessage = message
      //   //...
      //   console.log(enhancedMessage);
      // })

      jsdom.env({
        virtualConsole,
        url: options.url,
        src: getCompilationAssets(stats),
        done: (errors) => {
          if (errors) {
            errors.forEach(error => console.error(error))
          }
        },
        created(errors, window) {
          previousWindow = window
          if (errors) {
            console.error(errors)
          }
        },
      })
    })
  }
}
