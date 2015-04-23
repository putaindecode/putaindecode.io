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

// metalsmith-collections fix: collections are mutable
// fuck mutability
function backupCollections(collections) {
  const collectionsBackup = {}
  Object.keys(collections).forEach((key) => {
    collectionsBackup[key] = []
    collections[key].forEach((file) => {
      collectionsBackup[key].push(collections[key][file])
    })
  })
  return collectionsBackup
}

// metalsmith-collections fix: collections are in metadata as is + under metadata.collections
function updateCollections(metalsmith, collections) {
  const metadata = {
    ...metalsmith.metadata(),
    collections,
  }
  // copy ref to metadata root since metalsmith-collections use this references
  // as primary location (*facepalm*)
  Object.keys(collections).forEach((key) => {
    metadata[key] = collections[key]
  })
  metalsmith.metadata(metadata)
}

function runAndUpdate(metalsmith, files, livereload, options, previousFiles) {
  // metalsmith-collections fix: metalsmith-collections plugin add files to
  // collection when run() is called which create problem since we use run()
  // with only new files.
  // In order to prevent prevent duplicate issue (some contents will be available
  // in collections with the new and the previous version),
  // we remove from existing collections files that will be updated
  // (file already in the collections)
  // we iterate on collections with reference to previous files data
  // and skip old files that match the paths that will be updated
  const collectionsBackup = backupCollections(metalsmith.metadata().collections)
  const intermediateCollections = {}
  Object.keys(files).forEach((path) => {
    Object.keys(collectionsBackup).forEach((key) => {
      collectionsBackup[key].forEach((file) => {
        intermediateCollections[key] = []
        const pathsToTry = [path, path.replace(/\.md$/, ".html")]
        var shouldSkip = pathsToTry.some((testPath) => {
          if (file === previousFiles[testPath]) {
            return true
          }
        })
        if (!shouldSkip) {
          intermediateCollections[key].push(file)
        }
      })
    })
  })

  // metalsmith-collections fix: prepare collections with partials items
  // run() below will add the new files to the collections
  updateCollections(metalsmith, intermediateCollections)

  metalsmith.run(files, function(err, freshFiles) {
    if (err) {
      // metalsmith-collections fix: rollback collections
      updateCollections(metalsmith, collectionsBackup)

      options.log(color.red(`✗ ${err.toString()}`))
      // babel use that to share information :)
      if (err.codeFrame) {
        err.codeFrame.split("\n").forEach(line => options.log(line))
      }
      return
    }

    // metalsmith-collections fix:  update ref for future tests
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
