import {denodeify as asyncify} from "promise"
import logger from "nano-logger"

const markdownlint = asyncify(require("markdownlint"))
const glob = asyncify(require("glob"))
const log = logger("markdownlint")
const lintFail = new Error("markdown lint failed")

async function lint() {
  const results = await markdownlint({
    files: [
      ...await glob("*.md"),
      ...await glob("src/**/*.md"),
      ...await glob("content/**/*.md"),
    ],
  })
  const resultsLines = results
    .toString()
    .split("\n")

  if (resultsLines.length) {
    resultsLines.forEach(line => log(line))
    throw lintFail
  }
}
/* eslint-disable no-process-exit */
lint()
  .catch(err => {
    if (err === lintFail) {
      console.log(err)
      process.exit(1)
    }
    // ahem
    // https://babeljs.slack.com/archives/questions/p1434088301000741
    else {
      setTimeout(() => {
        throw err
      }, 1)
    }
  })
