import React, { Component, PropTypes } from "react"
import cx from "classnames"
import Helmet from "react-helmet"
import { connect } from "react-redux"
import enhanceCollection from "statinamic/lib/enhance-collection"

import getLang from "i18n/getLang"
import PostsList from "PostsList"

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

  static contextTypes = {
    metadata: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }

  render() {
    const lang = getLang(this.context)
    const {
      head,
      // body,
    } = this.props

    const posts = enhanceCollection(this.props.collection, {
      filter: { layout: "Post" },
      sort: "date",
      reverse: true,
    })
    // TODO use a real filter
    .filter((post) => post.__filename.startsWith(`${ lang }/`))

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
