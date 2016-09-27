import React, { PropTypes } from "react"
import { Link } from "react-router"

import classes from "./styles.css"

import getLang from "../../i18n/getLang"
import getI18n from "../../i18n/get"
import Avatars from "../Avatars"
import AuthorsList from "../AuthorsList"

import formatDate from "../formatDate"

const PostPreview = ({ post }, context) => {
  const lang = getLang(context)
  const i18n = getI18n(context)
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
      <div className={classes.footer}>
        {
          post.tags &&
          <ul className="putainde-Tags putainde-List-item-tags">
          {
            post.tags.map(tag => {
              return (
                <li key={tag} className="putainde-Tag">
                  <Link
                    className="putainde-Tag-link"
                    to={ `/${ lang }/tag/${ encodeURIComponent(tag) }` }
                  >
                    { tag }
                  </Link>
                </li>
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
    </div>
  )
}

PostPreview.propTypes = {
  post: PropTypes.object,
}

PostPreview.contextTypes = {
  metadata: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default PostPreview
