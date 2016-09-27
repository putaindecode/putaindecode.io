import React, { PropTypes } from "react"

import Contributor from "../Contributor"
import getI18n from "../../i18n/get"

const getGithubUrl
  = (repo, action, filename) => `${repo}/${action}/master/content/${filename}`

const Contributors = ({ filename, reviewers }, context) => {
  const i18n = getI18n(context)
  const { metadata } = context
  const contributors = metadata.contributors
  const httpRepository = metadata.pkg.repository.replace(/\.git$/, "")

  const fileContributors = contributors.files &&
  contributors.files[`content/${filename}`] || []

  // Merges people that have contributed to the file + reviewers (with dedup)
  const people = reviewers.reduce((acc, cur) => {
    if (acc.indexOf(cur) === -1) acc.push(cur)
    return acc
  }, Object.keys(fileContributors))

  return (
    <div className="putainde-Contributors">
      <strong className="putainde-Contributors-label">
      { people.length === 1 && i18n.BeTheFirstToContribute }
      { people.length > 1 &&
        `${people.length} ${i18n.contributors} ` + i18n.onThisPage
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
        people.length && people.map((login, idx) => {
          if (login === undefined) {
            console.warn(`${filename} have an undefined contributor.`)
          }
          return (
            <Contributor
              author={ login }
              commits={ parseInt(fileContributors[login], 10) || 0 }
              size={ "small" }
              key={ idx }
            />
          )
        })
      }
    </div>
  )
}

Contributors.propTypes = {
  filename: PropTypes.string.isRequired,
  reviewers: PropTypes.array,
}

Contributors.defaultProps = {
  reviewers: [],
}

Contributors.contextTypes = {
  metadata: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default Contributors
