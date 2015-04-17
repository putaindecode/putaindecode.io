import React, {Component, PropTypes} from "react"
import cx from "classnames"

import Avatar from "../Avatar"

export default class Avatars extends Component {

  static displayName = "Avatars"

  static contextTypes = {
    i18n: PropTypes.object,
  }

  static propTypes = {
    authors: PropTypes.arrayOf(PropTypes.string).isRequired,
    size: PropTypes.number
  }

  render() {
    const authors = this.props.authors
    return (
      <div
        className={cx({
          "putainde-Avatars": true,
          "putainde-Avatars--multi": authors.length > 1,
          [`putainde-Avatars--${authors.length}`]: authors.length > 1,
        }, this.props.className)}
      >
      {
        authors.map((author) => {
          return (
            <div key={author} className="putainde-List-avatars-author">
              <Avatar author={author} className="putainde-List-avatars-author-avatar" />
            </div>
          )
        })
      }
      </div>
    )
  }
}
