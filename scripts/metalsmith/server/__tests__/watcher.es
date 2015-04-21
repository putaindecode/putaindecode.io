import fs from "fs"
import path from "path"

import tape from "tape"
import {sync as rm} from "rimraf"
import {sync as mkdirp} from "mkdirp"
import chalk from "chalk"

import Metalsmith from "metalsmith"
import watch, {close} from "../watcher"

const noop = () => {}

function cleanTests(key) {
  rm(`./tmp-${key}`)
  close()
}

function prepareTests(key, testCb, assertionCb, options) {
  const folder = `./tmp-${key}`
  const metalsmith = new Metalsmith(folder)

  rm(folder)
  mkdirp(`${folder}/src`)
  fs.writeFileSync(`${folder}/src/dummy`, "")

  metalsmith
    .use(watch({
      log: noop,
      ...options,
    }))
    .build(() => {
      metalsmith
        .use((files) => {
          if (assertionCb !== noop) {
            assertionCb(files)
            cleanTests(key)
          }
        })
      testCb()
    })

  return folder
}

tape("metalsmith-server/watcher", (test) => {

  test.test("logs", (t) => {
    const logs = []
    const key = "logs"
    const folder = prepareTests(
      key,
      () => fs.writeFile(`${folder}/src/test`, "Test", noop),
      () => {
        t.deepEqual(
          logs,
          [
            "Started watching **/*",
            "add: test",
          ],
          "should logs things")
        t.end()
      },
      {
        log: (log) => {
          // console.log("# " + log)¬
          logs.push(chalk.stripColor(log))
        },
      }
    )
  })

  test.test("track create", (t) => {
    const key = "create"
    const folder = prepareTests(
      key,
      () => fs.writeFile(`${folder}/src/test`, "Test", noop),
      (files) => {
        t.ok(files.test, "should rebuild on file creation")
        t.end()
      }
    )
  })

  test.test("track rename", (t) => {
    const key = "rename"
    const folder = prepareTests(
      key,
      () => fs.rename(`${folder}/src/dummy`, `${folder}/src/renamed`, noop),
      (files) => {
        t.ok(files.renamed, "should keep track of renamed files")
        t.end()
      }
    )
  })

  test.test("rebuild sibling mapping", (t) => {
    const key = "sibling"
    const sibling = `./tmp--sibling`
    prepareTests(
      key,
      () => {
        rm(sibling)
        mkdirp(sibling)
        fs.writeFile(`${sibling}/test`, "test", noop)
      },
      () => {
        t.pass("should rebuild if a mapped item get updated")
        t.end()
      },
      {
        paths: {
          "**/*": "**/*",
          [`${sibling}/**/*`]: "**/*",
        }
      }
    )
  })

  test.test("invalidate js cache", (t) => {
    const key = "cache"
    const folder = prepareTests(
      key,
      () => {
        const jsfile = path.join(process.cwd(), `${folder}/src/dummy.js`)
        fs.writeFile(jsfile, "module.exports = 1;", () => {
          t.equal(require(jsfile), 1, "should get the exported value")
          fs.writeFile(jsfile, "module.exports = 2;", () => {
            setTimeout(() => {
              t.equal(require(jsfile), 2, "should get the fresh exported value")
              t.end()
              cleanTests(key)
            }, 1000) // let watcher clean the cache
          })
        })
      },
      noop
    )
  })

  test.test("keep js cache", (t) => {
    const key = "keepcache"
    const folder = prepareTests(
      key,
      () => {
        const jsfile = path.join(process.cwd(), `${folder}/src/dummy.js`)
        fs.writeFile(jsfile, "module.exports = 1;", () => {
          t.equal(require(jsfile), 1, "should get the exported value")
          fs.writeFile(jsfile, "module.exports = 2;", () => {
            setTimeout(() => {
              t.equal(require(jsfile), 1, "should not update the cache")
              t.end()
              cleanTests(key)
            }, 1000) // let watcher clean the cache
          })
        })
      },
      noop,
      {
        invalidateCache: false,
      }
    )
  })

  test.end()
})
