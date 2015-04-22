import {resolve} from "path"

import async from "async"
import chokidar from "chokidar"
import color from "chalk"
import match from "multimatch"
import unyield from "unyield"

import livereloadServer from "./livereload"

var watching = {}

function invalidateCache(path, absolutePath, options) {
  if (require.cache[absolutePath]) {
    options.log(`${path} cache deleted`)
    delete require.cache[absolutePath]
  }
}

function livereloadFiles(livereload, files, options) {
  if(livereload) {
    const keys = Object.keys(files)
    options.log(`✔︎ ${Object.keys(keys).length} files reloaded`)
    livereload.changed({body: {files: keys}})
  }
}

function runAndUpdate(metalsmith, files, livereload, options, previousFiles) {
  // collection fix: update collections to prevent duplicate issue
  // we iterate on collections with reference to previous files data
  // and skip old files that match the paths that will be updated
  const metadata = metalsmith.metadata()
  const collections = metadata.collections
  Object.keys(files).forEach((path) => {
    Object.keys(collections).forEach((key) => {
      const newCollection = []
      metadata[key].forEach((file) => {
        const pathsToTry = [path, path.replace(/\.md$/, ".html")]
        var shouldSkip = pathsToTry.some((testPath) => {
          if (file === previousFiles[testPath]) {
            return true
          }
        })
        if (!shouldSkip) {
          newCollection.push(file)
        }
      })
      metadata[key] = newCollection
    })
  })

  metalsmith.run(files, function(err, freshFiles) {
    if(err) {throw err}

    // collection fix: update ref for future tests
    Object.keys(freshFiles).forEach((path) => {
      previousFiles[path] = freshFiles[path]
    })

    metalsmith.write(freshFiles, function(writeErr) {
      if(writeErr) {throw writeErr}

      livereloadFiles(livereload, freshFiles, options)
    })
  })
}

function buildFiles(metalsmith, paths, livereload, options, previousFiles) {
  const files = {}
  async.each(
    paths,
    (path, cb) => {
      metalsmith.readFile(path, function(err, file) {
        if (err) {
          console.error(err)
          return
        }

        files[path] = file
        cb()
      })
    },
    (err) => {
      if (err) {
        console.error(err)
        return
      }

      runAndUpdate(metalsmith, files, livereload, options, previousFiles)
    }
  )
}


function buildPattern(metalsmith, pattern, livereload, options, previousFiles) {
  unyield(metalsmith.read())((err, files) => {
    if (err) {
      console.error(err)
      return
    }

    const filesToUpdate = {}
    match(Object.keys(files), pattern).forEach((path) => filesToUpdate[path] = files[path])
    options.log(color.gray(`- Updating ${Object.keys(filesToUpdate).length} files...`))
    runAndUpdate(metalsmith, filesToUpdate, livereload, options, previousFiles)
  })
}

export default function(options) {
  options = {
    ...{
      paths: "**/*",
      livereload: false,
      log: (...args) => {
        console.log(color.gray("[metalsmith-server]"), ...args)
      },
      chokidar: {
        ignoreInitial: true,
      },
      invalidateCache: true,
    },
    ...(options || {}),
  }

  if (typeof options.paths === "string") {
    options.paths = {[options.paths]: options.paths}
  }

  let livereload
  if(options.livereload) {
    livereload = livereloadServer(options.livereload, options.log)
  }

  return (files, metalsmith, cb) => {
    var source = metalsmith.source()

    Object.keys(options.paths).forEach(pattern => {
      if(watching[pattern] !== undefined) {return}

      const rebuildItself = options.paths[pattern] === true
      const chokidarOpts = {
        ...options.chokidar,
        cwd: (options.chokidar.cwd ? options.chokidar.cwd : (rebuildItself ? source : undefined)),
      }
      const watcher = chokidar.watch(pattern, chokidarOpts)

      watcher.on("ready", () => {
        options.log(`✔︎ Watching ${color.cyan(pattern)}`)
        cb()
      })

      // Delay watch update to be able to bundle multiples update in the same build
      // Saving multiples files at the same time create multiples build otherwise
      let updateDelay = 50
      let updatePlanned = false
      let pathsToUpdate = []
      const update = () => {
        if (options.invalidateCache) {
          pathsToUpdate.forEach(path => {
            invalidateCache(path, rebuildItself ? resolve(source, path) : resolve(path), options)
          })
        }

        // update itself
        if (rebuildItself) {
          buildFiles(metalsmith, pathsToUpdate, livereload, options, files)
        }
        // mapping rebuild
        else {
          buildPattern(metalsmith, options.paths[pattern], livereload, options, files)
        }
      }

      watcher.on("all", (event, path) => {
        if (event === "add") {
          options.log(`✔︎ ${color.cyan(path)} added`)
        }
        else if (event === "change") {
          options.log(`✔︎ ${color.cyan(path)} updated`)
        }
        else if (event === "unlink") {
          options.log(`✔︎ ${color.cyan(path)} removed`)
        }

        // delay
        if (event === "add" || event === "change") {
          pathsToUpdate.push(path)
          if (updatePlanned) {
            clearTimeout(updatePlanned)
          }
          updatePlanned = setTimeout(update, updateDelay)
        }
      })

      watching[pattern] = watcher
    })

    cb()
  }
}

// Expose close method for test-suite.
export function close() {
  Object.keys(watching).forEach((key) => {
    watching[key].close()
  })

  watching = {}
}
