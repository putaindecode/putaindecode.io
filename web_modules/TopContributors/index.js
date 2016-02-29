import React, { PropTypes } from "react"

import Contributor from "../Contributor"

import getI18n from "../i18n/get"

const TopContributors = ({ recentContributions }, context) => {
  const i18n = getI18n(context)
  const recentContributors = recentContributions
    ? Object.keys(recentContributions)
    : []
  recentContributors.sort(
    (a, b) => (
      recentContributions[b]
      - recentContributions[a]
    )
  )
  const topContributors = recentContributors.slice(0, 8)

  const { metadata } = context
  const httpRepository = metadata.pkg.repository.replace(/\.git$/, "")

  return (
    <div>
      <div className="putainde-Title putainde-Title--home">
        <h2 className="putainde-Title-text">
          { i18n.topContributors }
        </h2>
        <small style={ { opacity: .5 } }>
          { i18n.topContributorsNote }
        </small>
      </div>

      <div
        className="r-Grid r-Grid--withGutter"
        style={ { textAlign: "center" } }
      >
        {
          !topContributors.length &&
          <p
            className="r-Grid-cell"
            style={ { opacity: .5 } }
          >
            { i18n.topContributorsNoData }
          </p>
        }
        {
          topContributors.length &&
          topContributors.map(author => {
            return (
              <div
                key={author}
                className={
                  "r-Grid-cell r-all--1of4 r-minM--1of8"
                }
              >
                <Contributor
                  author={ author }
                  commits= { recentContributions[author] }
                />
              </div>
            )
          })
        }
        <div className="r-Grid-cell">
          <a
            href={ `${ httpRepository }/graphs/contributors` }
            className="putainde-Button putainde-Button--block"
          >
            { i18n.allContributors }
          </a>
        </div>
      </div>
    </div>
  )
}

TopContributors.propTypes = {
  recentContributions: PropTypes.object.isRequired,
}

TopContributors.contextTypes = {
  metadata: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default TopContributors
