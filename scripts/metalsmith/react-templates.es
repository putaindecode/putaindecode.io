import fs from "fs"
import path from "path"

import {each} from "async"
import extend from "extend"
import match from "multimatch"
import react from "react"

import deBug from "debug"

const debug = deBug("metalsmith-react-templates")

function renderReactTemplate(name, options, fn) {
  // Option for nonStatic rendering
  // Usually used if we want to do a static first load
  // but dynamic interation subsequently.
  // i.e. React Server side rendering style
  var isNonStatic = options.nonStatic
  delete options.nonStatic

  // Initialize the template as a factory
  // and apply the options into the factory.
  var Factory = react.createFactory(require(name))
  var parsed = new Factory(options)

  try {
    // Render to Static Markup (React ids removed)
    // Render to String (with React ids)
    var content = (isNonStatic) ? react.renderToString(parsed) : react.renderToStaticMarkup(parsed)

    fn(null, content)
  }
  catch (err) {
    fn(err)
  }
}


/**
 *  Simple Micro Templating Function
 */
function tmpl(str, data){
  var exp,
      regex

  // Iterates through the keys in file object
  // and interpolate / replace {{key}} with it"s value
  for (var k in data){
    if (data.hasOwnProperty(k)){
      exp = "{{"+k+"}}"
      regex = new RegExp(exp, "g")
      str = str.replace(regex, data[k])
    }
  }

  data.contents = new Buffer(str)

  return data
}


export default function (opts){
  opts = opts || {}

  var dir = opts.directory || "templates"
  var def = opts.defaultTemplate || "default.jsx"
  var baseFile = opts.baseFile || false
  var pattern = opts.pattern || null
  var preserve = opts.preserve || null
  var globalData = opts.data || {}
  var html = (opts.html === undefined) ? true : opts.html

  return function(files, metalsmith, done){
    var metadata = metalsmith.metadata()

    // Check Parameters
    function check(file){
      var data = files[file]
      var hasTmpl = data.template || def

      if (pattern !== null && !match(file, pattern)[0]){
        // console.log(file, "skipped because matching", pattern)
        return false
      }

      if (!hasTmpl){
        return false
      }

      return true
    }


    // Iterating and changing contents to string
    Object.keys(files).forEach(function(file){
      if (!check(file)){
        return
      }

      debug("Converting contents to string: %s", file)

      var data = files[file]
      data.contents = data.contents.toString()

      // if opt.preserve is set
      // preserve the raw, not templated content
      if (preserve !== null){
        debug("Preserving untouched contents: %s", file)
        data.rawContents = data.contents
      }
    })

    // Running all files against the renderer.
    function convert(file, converted){

      if (!check(file)){
        return converted()
      }

      debug("Starting conversion: %s", file)

      var data = {
        ...globalData,
        file: {
          _filename: file,
          ...files[file],
        },
      }
      var clone = extend({}, metadata, data)

      var filePath = metalsmith.path(dir, files[file].template || def)

      // Resolving the baseFile option to path.
      if(baseFile){
        baseFile = metalsmith.path(dir, baseFile)
      }

      // Start the process of applying templates
      renderReactTemplate(filePath, clone, function(err, str){
        if (err){
          return done(err)
        }

        data.contents = new Buffer(str)
        if (baseFile){
          debug("Applying baseFile to contents: %s", file)

          var baseStr = fs.readFileSync(baseFile, "utf8")
          data = tmpl(baseStr, data)
        }

        if (html){
          var fileDir = path.dirname(file)
          var fileName = path.basename(file, path.extname(file)) + ".html"
          if (fileDir !== "."){
            fileName = fileDir + "/" + fileName
          }

          debug("Renaming file: %s -> %s", file, fileName)

          delete files[file]
          files[fileName] = data
        }

        debug("Saved file: %s", file)
        converted()
      })

    }

    // Iterate and convert all files in object.
    each(Object.keys(files), convert, done)
  }

}
