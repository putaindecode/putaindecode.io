import jsdom from "jsdom"

export default function runTestsWithJSDOM(options) {
  if (!options.url) {
    throw new Error("runTestsWithJSDOM() expect at least an url")
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
        src: [
          stats.compilation.assets["tests.js"]._cachedSource,
        ],
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
