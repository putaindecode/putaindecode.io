import React, {Component, PropTypes} from "react"
import cx from "classnames"

import Avatar from "../Avatar"

export default class Contributors extends Component {

  static displayName = "Contributors"

  static contextTypes = {
    pkg: PropTypes.object.isRequired,
    contributors: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired,
  }

  static propTypes = {
    filename: PropTypes.string.isRequired,
  }

  static getGithubUrl(repo, action, filename) {
    return `${repo}/${action}/master/content/${filename}`
  }

  render() {
    const filename = this.props.filename
    const pkg = this.context.pkg
    const contributors = this.context.contributors
    const i18n = this.context.i18n
    const fileContributors = contributors.files[`content/${filename}`]

    const nbFileContributors = fileContributors
      ? Object.keys(fileContributors).length
      : 1

    return (
      <div className="putainde-Contributors">
        <strong className="putainde-Contributors-label">
        {
          nbFileContributors === 1 &&
          i18n.BeTheFirstToContribute
        }
        {
          nbFileContributors > 1 &&
          `${nbFileContributors} ${this.context.i18n.contributors} ` +
          this.context.i18n.onThisPage
        }
        </strong>

        <div className="r-Grid putainde-Contributors-actions">
          <div className="r-Grid-cell r-all--1of3">
            <a
              className="putainde-Contributors-action"
              href={
                Contributors.getGithubUrl(
                  pkg.repositoryHttpUrl,
                  "edit",
                  filename
                )
              }
            >
              {i18n.pageEdit}
            </a>
          </div>
          <div className="r-Grid-cell r-all--1of3">
            <a
              className="putainde-Contributors-action"
              href={
                Contributors.getGithubUrl(
                  pkg.repositoryHttpUrl,
                  "blame",
                  filename
                )
              }
            >
              {i18n.pageBlame}
            </a>
          </div>
          <div className="r-Grid-cell r-all--1of3">
            <a
              className="putainde-Contributors-action"
              href={
                Contributors.getGithubUrl(
                  pkg.repositoryHttpUrl,
                  "commits",
                  filename
                )
              }
            >
              {i18n.pageHistory}
            </a>
          </div>
        </div>

        {
          nbFileContributors > 1 && fileContributors &&
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
