import React, { PropTypes } from "react"
import cx from "classnames"

import Avatar from "../Avatar"

const Contributor = ({ author, commits, size }) => (
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

Contributor.propTypes = {
  author: PropTypes.string.isRequired,
  commits: PropTypes.number,
  size: PropTypes.string,
}

export default Contributor
