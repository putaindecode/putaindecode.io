import React, { Component, PropTypes } from "react"

import Contributor from "Contributor"

import getI18n from "i18n/get"

export default class TopContributors extends Component {

  static propTypes = {
    recentContributions: PropTypes.object.isRequired,
  }

  static contextTypes = {
    metadata: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }

  render() {
    const i18n = getI18n(this.context)
    const { recentContributions } = this.props
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

    const { metadata } = this.context
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
}
