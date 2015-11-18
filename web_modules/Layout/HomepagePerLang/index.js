import React, { Component, PropTypes } from "react"
import cx from "classnames"
import Helmet from "react-helmet"

import SVGIcon from "SVGIcon"

import LatestPosts from "LatestPosts"
import TopContributors from "TopContributors"

import { connect } from "react-redux"
import enhanceCollection from "statinamic/lib/enhance-collection"

import getI18n from "i18n/get"

export default
@connect(
  ({ collection }) => {
    return { collection }
  }
)
class HomepagePerLang extends Component {

  static propTypes = {
    head: PropTypes.object.isRequired,
    body: PropTypes.string.isRequired,
  }

  static contextTypes = {
    metadata: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }

  render() {
    const i18n = getI18n(this.context)

    const {
      head,
      body,
    } = this.props

    const latestPosts = enhanceCollection(this.props.collection, {
      filter: { layout: "Post" },
      sort: "date",
      reverse: true,
      limit: 6,
    })

    return (
      <div className="putainde-Main">
        <Helmet
          title={ head.title }
          meta={[
            { property: "og:title", content: head.title },
            { name: "twitter:title", content: head.title },
          ]}
        />

        <LatestPosts posts={latestPosts} />

        <div className="putainde-Section putainde-Section--manifesto">
          <div className="r-Grid r-Grid--alignCenter">
            <div
              className={cx(
                "r-Grid-cell",
                "r-minM--8of12",
                "putainde-Section-contents",
                "putainde-Post-contents"
              )}
            >
              <div className="putainde-Title putainde-Title--home">
                <h2 className="putainde-Title-text">{i18n.manifesto}</h2>
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: body }}
              />
              <div className="putainde-Networks">
                <a
                  className="putainde-Network"
                  href={i18n.github}
                  title={i18n.githubLabel}
                >
                  <SVGIcon
                    className="putainde-Icon"
                    svg={require(`icons/github.svg`)}
                    cleanup
                  />
                </a>
                {i18n.elsewhere}
                <a
                  className="putainde-Network"
                  href={i18n.twitter}
                  title={i18n.twitterLabel}
                >
                  <SVGIcon
                    className="putainde-Icon"
                    svg={require(`icons/twitter.svg`)}
                    cleanup
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        <TopContributors />
      </div>
    )
  }
}
