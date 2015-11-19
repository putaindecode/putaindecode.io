import React, { Component, PropTypes } from "react"
import cx from "classnames"
import Helmet from "react-helmet"
import { Link } from "react-router"
import { connect } from "react-redux"
import enhanceCollection from "statinamic/lib/enhance-collection"

import getI18n from "i18n/get"
import LatestPosts from "LatestPosts"
import TopContributors from "TopContributors"

import styles from "./styles.css"

export default
@connect(
  ({ collection }) => {
    return { collection }
  }
)
class Homepage extends Component {

  static propTypes = {
    head: PropTypes.object.isRequired,
    body: PropTypes.string.isRequired,
  }

  static contextTypes = {
    metadata: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }

  render() {
    const {
      head,
      body,
    } = this.props

    const i18n = getI18n(this.context)
    const allI18n = this.context.metadata.i18n

    const latestPosts = enhanceCollection(this.props.collection, {
      filter: { layout: "Post" },
      sort: "date",
      reverse: true,
    })

    const latestPostsEN = latestPosts
      .filter((post) => post.__filename.startsWith(`en/`))
      .slice(0, 3)

    const latestPostsFR = latestPosts
      .filter((post) => post.__filename.startsWith(`fr/`))
      .slice(0, 3)

    return (
      <div>
        <Helmet
          title={ head.title }
          meta={[
            { property: "og:title", content: head.title },
            { name: "twitter:title", content: head.title },
          ]}
        />

      <div className={ styles.header }>
          <div className={ styles.headerCell }>
            <em>{ i18n.title }</em>
            { " " + i18n.jumbotron }
            <br />
            <br />
            { i18n.jumbotron2 }
          </div>
        </div>

        <div className={ "r-Grid r-Grid--large" }>
          <div
            className={ "r-Grid-cell r-minM--1of2" }
            style={ { padding: "0 1rem 0 2rem" } }
          >
            <LatestPosts
              posts={ latestPostsEN }
              title={ "Latest Posts" }
            />
          </div>
          <div
            className={ "r-Grid-cell r-minM--1of2" }
            style={ { padding: "0 2rem 0 1rem" } }
          >
            <LatestPosts
              posts={ latestPostsFR }
              title={ "Derniers articles" }
              link={ allI18n.fr.links.articles }
            />
          </div>
        </div>

        <Link
          to={ i18n.links.help.translate }
          style={ {
            display: "block",
            textAlign: "center",
            color: "#999",
            textDecoration: "none",
          } }
        >
          { i18n.helpToTranslate }
        </Link>

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
                  { i18n.howThisWorks }
                </h2>
              </div>

              <div dangerouslySetInnerHTML={{ __html: body }} />
            </div>
          </div>
        </div>

        <TopContributors />
      </div>
    )
  }
}
