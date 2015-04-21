import {resolve} from "path"

import chokidar from "chokidar"
import chalk from "chalk"
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
    options.log(`Livereload ${Object.keys(keys).length} files`)
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
            options.log(`${path} in collection ${key} will be refreshed`)
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

function buildFile(metalsmith, path, livereload, options, previousFiles) {
  metalsmith.readFile(path, function(error, file) {
    if(error) {throw error}

    runAndUpdate(metalsmith, {[path]: file}, livereload, options, previousFiles)
  })
}


function buildPattern(metalsmith, pattern, livereload, options, previousFiles) {
  unyield(metalsmith.read())((err, files) => {
    if(err) {throw err}

    const filesToUpdate = {}
    match(Object.keys(files), pattern).forEach((path) => filesToUpdate[path] = files[path])
    options.log(`Building ${Object.keys(filesToUpdate).length} files...`)
    runAndUpdate(metalsmith, filesToUpdate, livereload, options, previousFiles)
  })
}

export default function(options) {
  options = {
    ...{
      paths: "**/*",
      livereload: false,
      log: console.log,
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
        options.log(chalk.green("Started watching ") + chalk.cyan(pattern))
        cb()
      })

      watcher.on("all", (event, path) => {
        options.log(`${chalk.green(event)}: ${chalk.cyan(path)}`)

        if (event === "add" || event === "change") {
          if (options.invalidateCache) {
            invalidateCache(path, rebuildItself ? resolve(source, path) : resolve(path), options)
          }

          // update itself
          if (rebuildItself) {
            buildFile(metalsmith, path, livereload, options, files)
          }
          // mapping rebuild
          else {
            buildPattern(metalsmith, options.paths[pattern], livereload, options, files)
          }
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
