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
        Object.keys(this.props.posts).map((filename) => {
          const post = this.props.posts[filename]
          return <PostPreview key={post.route} post={post} />
        })
      }
      </div>
    )
  }
}
