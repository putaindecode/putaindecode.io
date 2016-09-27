import React, { PropTypes } from "react"

import PostPreview from "../PostPreview"

const PostsList = ({ posts }) => (
  <div className="putainde-List">
    { posts.map(post => <PostPreview key={post.title} post={post} />) }
  </div>
)

PostsList.propTypes = {
  posts: PropTypes.array,
}

export default PostsList
