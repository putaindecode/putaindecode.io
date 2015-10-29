import React, { Component } from "react"
import { PropTypes } from "react"
import Helmet from "react-helmet"

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
  }

  render() {
    const {
      pkg,
      i18n,
    } = this.context.metadata

    return (
      <div className="r-VerticalRhythm">
        <GoogleAnalyticsTracker params={ this.props.params }>
          <Helmet
            meta={[
              { property: "og:site_name", content: pkg.name },
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
