import React, { PropTypes } from "react"
import getCollection from "phenomic/lib/enhance-collection"

import Posts from "../layouts/Posts"
import getLang from "../i18n/getLang"
import getI18n from "../i18n/get"

const PostsByAuthor = (props, context) => {
  const lang = getLang(context)
  const i18n = getI18n(context)
  const { author } = props.params

  const posts = getCollection(context.collection, {
    filter: (item) => (
      item.layout === "Post" &&
      (item.authors && item.authors.indexOf(author) > -1) &&
      // only posts of the current language
      item.__filename.startsWith(`${ lang }/`)
    ),
    sort: "date",
    reverse: true,
  })

  return (
    <Posts
      head={ {
        title: i18n.postsWrittenBy + " " + author,
      } }
      posts={ posts }
    />
  )
}

PostsByAuthor.propTypes = {
  params: PropTypes.object,
}

PostsByAuthor.contextTypes = {
  collection: PropTypes.object.isRequired,
  metadata: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default PostsByAuthor
