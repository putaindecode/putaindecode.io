module.exports = {
  sources : {
    pages : "pages/**/**/**.jade",
    pagesRoot : "pages/",
    partials : "partials/**/*.jade",
    mixins : "mixins/**/*.jade",
    layouts : "layouts/**/*.jade",
    lang : "lang/index.json",
    icons : "icons/*.svg",
    stylesheets : "stylesheets/**/*.styl",
    mainStylesheet : "stylesheets/index.styl",
    fontStylesheet : "stylesheets/icons/index.styl",
    scripts : "scripts/**/*.js",
    libScripts : "scripts/lib/**/*.js",
    mainScript : "scripts/index.js",
    fonts : "fonts/**/*",
    images : "images/**/*",
    modules : "node_modules/",
    tasks : "tasks/**/*.js",
    tests : "test/**/*.js",
    public : ["public/.**", "public/**"]
  },

  dist : {
    pages : "dist/",
    public : "dist/",
    icons : "fonts/",
    fonts : "dist/fonts/",
    images : "dist/images/",
    stylesheets : "dist/stylesheets/",
    scripts : "dist/scripts"
  },

  templates : {
    fontStylesheet : "stylesheets/template/icons.styl"
  }
}
