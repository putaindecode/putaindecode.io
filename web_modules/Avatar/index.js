import React, { Component, PropTypes } from "react"

import getAuthorUri from "../getAuthorUri"
export default class Avatar extends Component {

  static contextTypes = {
    metadata: PropTypes.object.isRequired,
  }

  static propTypes = {
    className: PropTypes.string,
    author: PropTypes.string.isRequired,
  }

  render() {
    const { metadata } = this.context
    const author = metadata.contributors.getContributor(this.props.author)
    const size = size || 128

    return (
      <a
        href={getAuthorUri(author)}
        className={`putainde-Avatar ${this.props.className}`}
      >
        <img
          className="js-AnimateLoad"
          src={
            author && author.avatar_url
            ? author.avatar_url + "&s=" + size
            : "/images/defaultAvatar.png"
          }
          alt=""
        />
      </a>
    )
  }
}
