import React, { Component, PropTypes } from "react"
import cx from "classnames"

import Avatar from "../Avatar"

export default class Contributors extends Component {

  static contextTypes = {
    metadata: PropTypes.object.isRequired,
  }

  static propTypes = {
    filename: PropTypes.string.isRequired,
  }

  static getGithubUrl(repo, action, filename) {
    return `${repo}/${action}/master/content/${filename}`
  }

  render() {
    const { metadata } = this.context
    const i18n = metadata.i18n
    const contributors = metadata.contributors
    const httpRepository = metadata.pkg.repository.replace(/\.git$/, "")

    const filename = this.props.filename
    const fileContributors = contributors.files &&
    contributors.files[`content/${filename}`]

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
          `${nbFileContributors} ${i18n.contributors} ` +
          i18n.onThisPage
        }
        </strong>

        <div className="r-Grid putainde-Contributors-actions">
          <div className="r-Grid-cell r-all--1of3">
            <a
              className="putainde-Contributors-action"
              href={
                Contributors.getGithubUrl(
                  httpRepository,
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
                  httpRepository,
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
                  httpRepository,
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
            if (login === undefined) {
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
