import RSS from "rss"
import url from "url"

export default (options = {}) => {
  const {
    feedOptions,
    limit,
    encoding,
    destination,
    collection,
  } = {
    feedOptions: {},
    limit: 20,
    encoding: "utf8",
    destination: "rss.xml",
    collection: "posts",
    ...options,
  }

  return function(files, metalsmith, done) {
    if (!feedOptions.site_url) {
      return done(new Error("feedOptions.site_url must be configured"))
    }

    if (feedOptions.feed_url == null) {
      feedOptions.feed_url = url.resolve(feedOptions.site_url, destination)
    }

    if (typeof limit !== "number") {
      return done(new Error("limit must be a number"))
    }

    const metadata = metalsmith.metadata()

    if (!metadata.collections) {
      return done(new Error("no collections configured - see metalsmith-collections"))
    }

    if (!metadata.collections[collection].length) {
      return done(new Error(`no item in collections '${collection}' - see metalsmith-collections`))
    }

    const feed = new RSS(feedOptions)
    const collectionItems = metadata.collections[collection].slice(0, limit)

    collectionItems.forEach(item => {
      feed.item({
        // FIXME _filename defined by watcher for now
        url: url.resolve(feedOptions.site_url, item._filename),
        ...item,
        description: item.description || item.contents,
      })
    })

    files[destination] = {
      contents: new Buffer(
        feed.xml({
          indent: true,
        }),
        encoding
      ),
    }

    return done()
  }
}
