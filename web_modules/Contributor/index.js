import React, { Component, PropTypes } from "react"
import cx from "classnames"

import Avatar from "../Avatar"

export default class Contributor extends Component {

  static propTypes = {
    author: PropTypes.string.isRequired,
    commits: PropTypes.number,
    size: PropTypes.string,
  }

  render() {
    const {
      author,
      commits,
      size,
    } = this.props

    return (
      <div
        key={ author }
        className={ cx(
          "putainde-Contributor",
          "r-Tooltip",
          "r-Tooltip--bottom",
          "r-Tooltip--allowNewLines"
        ) }
        data-r-tooltip={ [
          author,
          `(${ commits } commit${ commits > 1 ? "s" : "" })`,
        ].join("\n") }
      >
        <Avatar
          author={ author }
          className={
            `putainde-Contributor-avatar${ size ? `--${ size }` : "" }`
          }
        />
      </div>
    )
  }
}
