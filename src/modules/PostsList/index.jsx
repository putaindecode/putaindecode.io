import React, {Component, PropTypes} from "react"

import PostPreview from "../PostPreview"

export default class PostsList extends Component {

  static displayName = "PostsList"

  static contextTypes = {
    i18n: PropTypes.object,
  }

  static propTypes = {
    posts: PropTypes.array,
  }

  render() {
    return (
      <div className="putainde-List">
      {
        this.props.posts.map((post) => {
          return <PostPreview key={post.title} post={post} />
        })
      }
      </div>
    )
  }
}
