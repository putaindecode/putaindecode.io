import React, { Component, PropTypes } from "react"

import Contributor from "Contributor"
import getI18n from "i18n/get"

export default class Contributors extends Component {

  static contextTypes = {
    metadata: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }

  static propTypes = {
    filename: PropTypes.string.isRequired,
  }

  static getGithubUrl(repo, action, filename) {
    return `${repo}/${action}/master/content/${filename}`
  }

  render() {
    const i18n = getI18n(this.context)
    const { metadata } = this.context
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
              <Contributor
                author={ login }
                commits={ fileContributors[login] }
                size={ "small" }
              />
            )
          })
        }
      </div>
    )
  }
}
