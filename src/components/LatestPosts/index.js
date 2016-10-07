import React, { PropTypes } from "react"
import { Link } from "react-router"

import classes from "./styles.css"

import getI18n from "../../i18n/get"
import PostsList from "../PostsList"

const LatestPosts = ({ link, posts, title }, context) => {
  const i18n = getI18n(context)

  return (
    <div>
      <div className="putainde-Title putainde-Title--home">
        <h2 className="putainde-Title-text">
          { title ? title : i18n.latestPosts }
        </h2>
      </div>
      <div
        className={ "r-Grid-cell r-minL--5of12 " + classes.latestPosts }
        style={ { textAlign: "left" } }
      >
        <PostsList posts={ posts.slice(0, posts.length / 2) } />
      </div>
      <div
        className={ "r-Grid-cell r-minL--5of12 " + classes.latestPosts }
        style={ { textAlign: "left" } }
      >
        <PostsList posts={ posts.slice(posts.length / 2) } />
      </div>
      <div
        className={ "r-Grid-cell r-minL--10of12 " + classes.latestPosts }
        style={ { textAlign: "left" } }
      >
        <Link
          to={ link ? link : i18n.links.articles }
          className="putainde-Button putainde-Button--block"
          style={ { textAlign: "center" } }
        >
          { i18n.morePosts }
        </Link>
      </div>
    </div>
  )
}

LatestPosts.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string,
  link: PropTypes.string,
}

LatestPosts.contextTypes = {
  metadata: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default LatestPosts
