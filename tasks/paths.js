/**
 * paths configuration
 */
module.exports = {
  sources : {
    pages : "pages/**/**/**.jade",
    pagesMd : "pages/**/**/**.md",
    feed : "feed/feed.jade",
    sitemap : "layouts/sitemap.jade",
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
    feed : "feed.xml",
    public : "dist/",
    icons : "fonts/",
    fonts : "dist/fonts/",
    sitemap : "sitemap.xml",
    images : "dist/images/",
    stylesheets : "dist/stylesheets/",
    scripts : "dist/scripts"
  },

  templates : {
    fontStylesheet : "stylesheets/template/icons.styl"
  }
}
