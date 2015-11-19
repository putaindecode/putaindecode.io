import React, { Component, PropTypes } from "react"
import cx from "classnames"
import Helmet from "react-helmet"
import { Link } from "react-router"

import LatestPosts from "LatestPosts"
import TopContributors from "TopContributors"

import { connect } from "react-redux"
import enhanceCollection from "statinamic/lib/enhance-collection"

import getLang from "i18n/getLang"
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
    const lang = getLang(this.context)
    const i18n = getI18n(this.context)

    const {
      head,
      body,
    } = this.props

    const posts = enhanceCollection(this.props.collection, {
      filter: { layout: "Post" },
      sort: "date",
      reverse: true,
    })
    // TODO use a real filter
    .filter((post) => post.__filename.startsWith(`${ lang }/`))
    const latestPosts = posts.slice(0, 6)

    return (
      <div className="putainde-Main">
        <Helmet
          title={ head.title }
          meta={[
            { property: "og:title", content: head.title },
            { name: "twitter:title", content: head.title },
          ]}
        />

        <div className="putainde-Section">
          <div className="r-Grid">
            <div
              className={cx(
                "r-Grid-cell",
                "r-minM--8of12",
                "putainde-Section-contents",
              )}
            >
              <LatestPosts posts={ latestPosts } />

              {
                <Link
                  to={ i18n.links.help.translate }
                  style={ {
                    ...{
                      display: "block",
                      textAlign: "center",
                      color: "#999",
                    },
                    ...posts.length < 10 && {
                      fontWeight: "bold",
                      color: "#111",
                    },
                  } }
                >
                  { i18n.helpToTranslate }
                </Link>
              }
            </div>
          </div>
        </div>

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
                <h2 className="putainde-Title-text">
                  { i18n.whatIsThis }
                </h2>
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: body }}
              />
            </div>
          </div>
        </div>

        <TopContributors />
      </div>
    )
  }
}
