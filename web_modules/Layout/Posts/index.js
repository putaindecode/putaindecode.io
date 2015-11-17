import React, { Component, PropTypes } from "react"
import cx from "classnames"
import Helmet from "react-helmet"

import PostsList from "PostsList"

import { connect } from "react-redux"
import enhanceCollection from "statinamic/lib/enhance-collection"

export default
@connect(
  ({ collection }) => {
    return { collection }
  }
)
class Posts extends Component {

  static propTypes = {
    collection: PropTypes.array.isRequired,
    head: PropTypes.object.isRequired,
    body: PropTypes.string.isRequired,
  }

  static childContextTypes = {
    metadata: PropTypes.object.isRequired,
  }

  render() {
    const {
      head,
      // body,
    } = this.props

    const posts = enhanceCollection(this.props.collection, {
      filter: { layout: "Post" },
      sort: "date",
      reverse: true,
    })
    // temporary workaround to only include french posts
    .filter((post) => post.__filename.startsWith("fr/"))

    return (
      <div className="putainde-Main">
        <Helmet
          title={ head.title }
          meta={[
            { property: "og:title", content: head.title },
            { name: "twitter:title", content: head.title },
          ]}
        />
        <div className="r-Grid putainde-Section">
          <div
            className={cx(
              "r-Grid-cell",
              "r-minM--8of12",
              "putainde-Section-contents",
              "js-Posts"
            )}
          >
            <div className="putainde-Title putainde-Title--home">
              <h2 className="putainde-Title-text">
                {head.title}
              </h2>
            </div>
            <PostsList posts={posts} />
          </div>
        </div>
      </div>
    )
  }
}
