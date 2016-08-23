import React, { PropTypes } from "react"
import enhanceCollection from "phenomic/lib/enhance-collection"

import Posts from "../layouts/Posts"
import getLang from "../i18n/getLang"
import getI18n from "../i18n/get"

const PostsByTag = (props, context) => {
  const lang = getLang(context)
  const i18n = getI18n(context)
  const { tag } = props.params

  const posts = enhanceCollection(context.collection, {
    filter: (item) => Boolean(
      item.layout === "Post" &&
      (item.tags && item.tags.indexOf(tag) > -1) &&
      // only posts of the current language
      item.__filename.startsWith(`${ lang }/`)
    ),
    sort: "date",
    reverse: true,
  })

  return (
    <Posts
      head={ {
        title: i18n.postsTaggedWith + " " + tag,
      } }
      posts={ posts }
    />
  )
}

PostsByTag.propTypes = {
  params: PropTypes.object,
}

PostsByTag.contextTypes = {
  collection: PropTypes.array.isRequired,
  metadata: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default PostsByTag
