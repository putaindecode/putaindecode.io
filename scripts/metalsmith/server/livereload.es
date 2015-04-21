import chalk from "chalk"
import tinylr from "tiny-lr"

export default function livereloadServer(options, log) {
  if(options === true) {
    options = {port: 35729}
  }
  else if(typeof options === "number") {
    options = {port: options}
  }

  const server = tinylr(options)

  server.on("error", function(err) {
    if(err.code === "EADDRINUSE") {
      log(chalk.red("Port " + options.port + " is already in use by another process."))
    }
    else {
      log(chalk.red(err))
    }

    throw err
  })

  server.listen(options.port, function(err) {
    if(err) {
      return log(chalk.red(err))
    }

    log(chalk.green("Live reload server started on port: " + options.port))
  })

  return server
}
