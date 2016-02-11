import React, { PropTypes } from "react"

import Contributor from "Contributor"
import getI18n from "i18n/get"

const getGithubUrl
  = (repo, action, filename) => `${repo}/${action}/master/content/${filename}`

const Contributors = ({ filename }, context) => {
  const i18n = getI18n(context)
  const { metadata } = context
  const contributors = metadata.contributors
  const httpRepository = metadata.pkg.repository.replace(/\.git$/, "")

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
              getGithubUrl(
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
              getGithubUrl(
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
              getGithubUrl(
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

Contributors.propTypes = {
  filename: PropTypes.string.isRequired,
}

Contributors.contextTypes = {
  metadata: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default Contributors
