var path = require("path")
  , exports = require("./exports")
  , lang = require("./lang")
  , contributors = require("./contributors")
  , marked = require("marked")
  , fs = require("fs")
  , lodash = require("lodash")
  , monthNames = ["jan.", "fév.", "mars", "avril", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."]

module.exports = {
  update : function(){
    this.value.locals.pages = exports.value
    this.value.locals.lang = lang.value
    this.value.locals.contributors = contributors.value
  },
  value : {
    basedir : path.resolve(__dirname, "../../"),
    locals : {
      pages : exports.value,
      lang : lang.value,
      contributors : contributors.value,
      uri : function(to, from){
        if(lodash.isArray(to)){
          to = path.join.apply(path, to)
        }
        if(lodash.isArray(from)){
          from = path.join.apply(path, from)
        }

        if(to.indexOf("://") !== -1) {
          return to
        }


        if(from) {
          to = path.relative(from.replace(/index$/, ""), to)
        }

        return to
          // windows OS fix
          .replace(/\\/g, "/")
          // remove useless & ugly trailing index.html
          .replace(/index\.html$/, "")
      },
      getPages : function(object){
        return lodash.where(exports.value, object)
      },
      getFeedDescription : function(post){
        return marked(
          fs.readFileSync(
            path.resolve(__dirname, "../../pages/", post + ".md"),
            "utf-8"
          )
        )
      },
      formatDate : function(date){
        date = new Date(date)

        return [
          date.getDate(),
          monthNames[date.getMonth()],
          date.getFullYear()
        ].join(" ")
      }
    }
  }
}
