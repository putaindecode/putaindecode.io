import React, {Component, PropTypes} from "react"

import Avatars from "../Avatars"
import AuthorsList from "../AuthorsList"

import formatDate from "../formatDate"

export default class PostPreview extends Component {

  static displayName = "PostPreview"

  static contextTypes = {
    i18n: PropTypes.object,
  }

  static propTypes = {
    post: PropTypes.object,
  }

  render() {
    const post = this.props.post
    const i18n = this.context.i18n
    return (
      <div className="putainde-List-item js-Post">

        <Avatars className="putainde-List-avatars" authors={post.authors} />

        <a
          className="putainde-Link putainde-List-title"
          href={post.route}
        >
          {post.title}
        </a>

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
          <AuthorsList authors={post.authors} />
          {
            post.date &&
            [
              <br/>,
              <time>{i18n.the} {formatDate(post.date)}</time>,
            ]
          }
        </div>
      </div>
    )
  }
}
