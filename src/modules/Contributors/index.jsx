import React, {Component, PropTypes} from "react"
import cx from "classnames"

import Avatar from "../Avatar"

export default class Contributors extends Component {

  static displayName = "Contributors"

  static contextTypes = {
    contributors: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired,
  }

  static propTypes = {
    filename: PropTypes.string.isRequired,
  }

  render() {
    const filename = this.props.filename
    const contributors = this.context.contributors
    const fileContributors = contributors.files[`content/${filename}`]
    if (fileContributors) {
      const nbFileContributors = Object.keys(fileContributors).length
      if (nbFileContributors > 1) {
        return (
          <div className="putainde-Contributors">
            <strong className="putainde-Contributors-label">
              {`${nbFileContributors} ${this.context.i18n.contributors}`}
            </strong>
            {
              Object.keys(fileContributors).map(login => {
                if (login === "undefined") {
                  console.warn(`${filename} have an undefined contributor.`)
                }
                return (
                  <div
                    key={login}
                    className={cx(
                      "putainde-Contributor",
                      "r-Tooltip",
                      "r-Tooltip--bottom",
                      "r-Tooltip--allowNewLines"
                    )}
                    data-r-tooltip={
                      `${login}\n(${fileContributors[login]} commit${
                        fileContributors[login] > 1 ? "s" : ""
                      })`
                    }
                  >
                    <Avatar
                      author={login}
                      className="putainde-Contributor-avatar"
                    />
                  </div>
                )
              })
            }
          </div>
        )
      }
    }

    return (
      <div
        className={cx(
          "putainde-Contributors",
          "putainde-Contributors--noAdditionalContributors"
        )}
      >
      </div>
    )
  }
}
