import React, { Component } from "react"
import { PropTypes } from "react"
import Helmet from "react-helmet"

import getLang from "i18n/getLang"
import getI18n from "i18n/get"
import Header from "Header"
import Footer from "Footer"
import GoogleAnalyticsTracker from "GoogleAnalyticsTracker"

export default class Layout extends Component {

  static propTypes = {
    children: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
    params: PropTypes.object,
  }

  static contextTypes = {
    metadata: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }

  render() {
    const i18n = getI18n(this.context)
    const locale = getLang(this.context)

    return (
      <div className="r-VerticalRhythm" lang={ locale }>
        <GoogleAnalyticsTracker params={ this.props.params }>
          <Helmet
            meta={[
              { property: "og:site_name", content: i18n.title },
              { name: "twitter:site", content: `@${ i18n.twitterUsername }` },
            ]}
          />
          <Header />
          {this.props.children}
          <Footer />
        </GoogleAnalyticsTracker>
      </div>
    )
  }
}
