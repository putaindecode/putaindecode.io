import marked from "marked"
import hljs from "highlight.js"

const renderer = new marked.Renderer()
const accents = {
  "à": "a",
  "á": "a",
  "â": "a",
  "ã": "a",
  "ä": "a",
  "å": "a",
  "æ": "ae",
  "ç": "c",
  "è": "e",
  "é": "e",
  "ê": "e",
  "ë": "e",
  "œ": "oe",
  "ì": "i",
  "í": "i",
  "î": "i",
  "ï": "i",
  "ñ": "n",
  "ò": "o",
  "ó": "o",
  "ô": "o",
  "õ": "o",
  "ö": "o",
  "ø": "o",
  "ù": "u",
  "ú": "u",
  "û": "u",
  "ü": "u",
  "ý": "y",
}
const accentsRE = RegExp("(" + Object.keys(accents).join("|") + ")", "g")
renderer.heading = function(text, level) {
  const escaped = text
      // url in lower case are cool
      .toLowerCase()

      // remove accents from title
      .replace(accentsRE, function(i) {
        return accents[i]
      })

      // strip html in anchors
      .replace(/(<\/?[^>]+>)/ig, "")

      // dashify
      .replace(/\W+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "")

  return (
    `<h${level} id="${escaped}">
      <a class="putainde-Title-anchor" href="#${escaped}">#</a>
      ${text}
    </h${level}>`
  )
}

marked.setOptions({

  renderer: renderer,

  highlight: (code, language) => {
    code = code.trim()

    // language is recognized by highlight.js
    if (hljs.getLanguage(language)) {
      return hljs.highlight(language, code).value
    }

    // fallback to auto
    return hljs.highlightAuto(code).value
  },

  gfm: true,
  tables: true,
  smartypants: true,
})

export default marked
