/**
 * paths configuration
 */
module.exports = {
  sources : {
    pages : "src/pages/**/**/**.jade",
    pagesMd : "src/pages/**/**/**.md",
    feed : "src/feed/feed.jade",
    sitemap : "src/layouts/sitemap.jade",
    pagesRoot : "src/pages/",
    partials : "src/partials/**/*.jade",
    mixins : "src/mixins/**/*.jade",
    layouts : "src/layouts/**/*.jade",
    lang : "src/lang/index.json",
    icons : "src/**/icons/*.svg",
    stylesheets : "src/stylesheets/",
    scripts : "src/scripts/**/*.js",
    libScripts : "src/scripts/lib/**/*.js",
    mainScript : "src/scripts/index.js",
    fonts : "src/fonts/**/*",
    assets : ["src/pages/**/*.!(jade|md)"],
    tasks : "tasks/**/*.js",
    tests : "test/**/*.js",
    public : ["src/public/.**", "src/public/**"]
  },

  tmp : "tmp/",

  dist : {
    public : "dist/",
    pages : "dist/",
    icons : "fonts/",
    fonts : "dist/fonts/",
    assets : "dist/",
    stylesheets : "dist/stylesheets/",
    scripts : "dist/scripts"
  }
}
