import React, { Component, PropTypes } from "react"
import cx from "classnames"
import Helmet from "react-helmet"
import { Link } from "react-router"
import { connect } from "react-redux"
import enhanceCollection from "statinamic/lib/enhance-collection"

import supportLocale from "browser-locale-support"
import getLang from "i18n/getLang"
import getI18n from "i18n/get"
import I18nBanner from "I18nBanner"
import LatestPosts from "LatestPosts"
import TopContributors from "TopContributors"

import classes from "./styles.css"

const supportedLocales = [ "fr", "en" ]

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

  componentWillMount() {
    this.prepareI18nBanner()
  }

  componentWillReceiveProps() {
    this.prepareI18nBanner()
  }

  prepareI18nBanner() {
    this.hideI18nBanner()

    if (typeof window !== "undefined") {
      setTimeout(() => {
        const locale = getLang(this.context)
        if (
          window.localStorage
          && !window.localStorage.getItem(`i18nBanner-${ locale }`)
          && !supportLocale({ locale, supportedLocales })) {
          this.showI18nBanner()
        }
      }, 2000)
    }
  }

  showI18nBanner() {
    this.setState({ i18nBanner: true })
  }

  hideI18nBanner(forever) {
    this.setState({ i18nBanner: false })
    if (forever) {
      window.localStorage.setItem(`i18nBanner-${ forever }`, 1)
    }
  }

  render() {
    const {
      head,
      body,
    } = this.props

    const i18n = getI18n(this.context)
    const locale = getLang(this.context)
    const anotherLocale = supportedLocales.filter((l) => l !== locale)[0]

    const latestPosts = enhanceCollection(this.props.collection, {
      filter: { layout: "Post" },
      sort: "date",
      reverse: true,
    })
    .filter((post) => post.__filename.startsWith(`${ locale }/`))
    .slice(0, 3)

    const { recentContributions } = this.context.metadata.contributors

    return (
      <div>
        <Helmet
          title={ head.title }
          meta={[
            { property: "og:title", content: head.title },
            { name: "twitter:title", content: head.title },
          ]}
        />

      {
        this.state && this.state.i18nBanner &&
        <I18nBanner
          labels={ this.context.metadata.i18n[anotherLocale].i18nBanner }
          onAccept={ () => window.location = `/${ anotherLocale }/` }
          onHide={ () => this.hideI18nBanner() }
          onHideForever={ () => this.hideI18nBanner(locale) }
        />
      }

      <div className={ classes.header }>
          <div className={ classes.headerCell }>
            <em>{ i18n.title }</em>
            { " " + i18n.jumbotron }
            <br />
            <br />
            { i18n.jumbotron2 }
          </div>
        </div>

        <div
          className={ "r-Grid" }
          style={ {
            maxWidth: "none",
            textAlign: "center",
          } }
        >
          <div
            className={ "r-Grid-cell r-minM--8of12 " + classes.latestPosts }
            style={ { textAlign: "left" } }
          >
            <LatestPosts
              posts={ latestPosts }
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

        <TopContributors recentContributions={ recentContributions } />
      </div>
    )
  }
}
