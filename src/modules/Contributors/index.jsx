import React, {Component, PropTypes} from "react"

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
    const fileContributors = this.context.contributors.files[`content/${this.props.filename}`]
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
                  console.warn(`${this.props.filename} have an undefined contributor.`)
                }
                return (
                  <div
                    key={login}
                    className="putainde-Contributor r-Tooltip r-Tooltip--bottom"
                    data-r-tooltip={`${login}\n(${fileContributors[login]} commit${fileContributors[login] > 1 ? "s" : ""})`}
                    style={{whiteSpace: "pre"}/* for the \n in data-r-tooltip */}
                  >
                    <Avatar author={login} className="putainde-Contributor-avatar" />
                  </div>
                )
              })
            }
          </div>
        )
      }
    }

    return (
      <div className="putainde-Contributors putainde-Contributors--noAdditionalContributors"></div>
    )
  }
}
