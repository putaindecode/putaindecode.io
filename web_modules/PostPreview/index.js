import React, { Component, PropTypes } from "react"
import { Link } from "react-router"

import getI18n from "i18n/get"
import Avatars from "../Avatars"
import AuthorsList from "../AuthorsList"

import formatDate from "../formatDate"

export default class PostPreview extends Component {

  static contextTypes = {
    metadata: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }

  static propTypes = {
    post: PropTypes.object,
  }

  render() {
    const i18n = getI18n(this.context)

    const post = this.props.post

    return (
      <div className="putainde-List-item js-Post">

        {
          post.authors &&
          <Avatars className="putainde-List-avatars" authors={post.authors} />
        }

        <Link
          className="putainde-Link putainde-List-title"
          to={post.__url}
        >
          {post.title}
        </Link>

        {
          post.tags &&
          <ul className="putainde-Tags putainde-List-item-tags">
          {
            post.tags.map(tag => {
              return (
                <li key={tag} className="putainde-Tag">{tag}</li>
              )
            })
          }
          </ul>
        }

        <div className="putainde-List-author">
          {i18n.initialCommit}
          {" "}
          { post.authors && <AuthorsList authors={post.authors} /> }
          {
            post.date &&
              [
                <br key="br" />,
                <time key={post.date}>{ formatDate(post.date) }</time>,
              ]
          }
        </div>
      </div>
    )
  }
}
