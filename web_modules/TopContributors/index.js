import React, { Component, PropTypes } from "react"
import { Link } from "react-router"

import Author from "../Author"

export default class TopContributors extends Component {

  static contextTypes = {
    metadata: PropTypes.object.isRequired,
  }

  render() {
    const { metadata } = this.context
    const i18n = metadata.i18n
    const contributors = metadata.contributors
    const pkg = metadata.pkg

    let topContributors = Object.keys(contributors.map)
    topContributors.sort(
      (a, b) => contributors.contributions[b] - contributors.contributions[a]
    )
    topContributors = topContributors.slice(0, 12)

    return (
      <div>
        <div className="putainde-Title putainde-Title--home">
          <h2 className="putainde-Title-text">
            {i18n.topContributors}
          </h2>
        </div>

        <div className="r-Grid r-Grid--withGutter">
          {
            topContributors.map(author => {
              return (
                <div key={author} className="r-Grid-cell r-all--1of2">
                  <Author
                    author={author}
                    afterName={
                      `(${contributors.contributions[author]} commits)`
                    }
                  />
                </div>
              )
            })
          }
          <div className="r-Grid-cell">
            <Link
              className="putainde-Button putainde-Button--block"
              to={`${pkg.repositoryHttpUrl}/graphs/contributors`}
            >
              {i18n.allContributors}
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
