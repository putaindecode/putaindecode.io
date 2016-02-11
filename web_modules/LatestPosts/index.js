import React, { Component, PropTypes } from "react"
import { Link } from "react-router"

import classes from "./styles.css"

import getI18n from "i18n/get"
import PostsList from "../PostsList"

export default class LatestPosts extends Component {

  static contextTypes = {
    metadata: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }

  static propTypes = {
    posts: PropTypes.arrayOf(PropTypes.object).isRequired,
    title: PropTypes.string,
    link: PropTypes.string,
  }

  render() {
    const i18n = getI18n(this.context)
    console.log(i18n)
    const {
      title,
      posts,
      link,
    } = this.props

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
}
