import React, {Component, PropTypes} from "react"

import getAuthorUri from "../getAuthorUri"
export default class Avatar extends Component {

  static contextTypes = {
    contributors: PropTypes.object,
    i18n: PropTypes.object,
  }

  static propTypes = {
    className: PropTypes.string,
    author: PropTypes.string.isRequired,
  }

  render() {
    const author = this.context.contributors.getContributor(this.props.author)
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
