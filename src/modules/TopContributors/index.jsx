import React, {Component, PropTypes} from "react"

import Author from "../Author"

export default class TopContributors extends Component {

  static displayName = "TopContributors"

  static contextTypes = {
    contributors: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired,
    pkg: PropTypes.object.isRequired,
  }

  render() {
    const contributors = this.context.contributors
    const i18n = this.context.i18n
    const pkg = this.context.pkg

    let topContributors = Object.keys(contributors.map)
    topContributors.sort((a, b) => contributors.contributions[b] - contributors.contributions[a])
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
                  <Author author={author} afterName={`(${contributors.contributions[author]} commits)`}/>
                </div>
              )
            })
          }
          <div className="r-Grid-cell">
            <a
              className="putainde-Button putainde-Button--block"
              href={`${pkg.repositoryHttpUrl}/graphs/contributors`}
            >
              {i18n.allContributors}
            </a>
          </div>
        </div>
      </div>
    )
  }
}
