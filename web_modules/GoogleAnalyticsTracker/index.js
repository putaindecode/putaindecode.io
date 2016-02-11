import React, { Component } from "react"
import { PropTypes } from "react"

import ga from "react-google-analytics"
const GoogleAnalyticsInitiailizer = ga.Initializer

class GoogleAnalyticsTracker extends Component {
  componentWillMount() {
    const { pkg } = this.context.metadata
    if (__PROD__) {
      ga("create", pkg.googleAnalyticsUA, "auto")
    }
    if (__DEV__) {
      console.info("ga.create", pkg.googleAnalyticsUA)
    }
    this.logPageview()
  }

  componentWillReceiveProps(props) {
    if (props.params.splat !== this.props.params.splat) {
      this.logPageview()
    }
  }

  logPageview() {
    if (__PROD__) {
      ga("send", "pageview")
    }
    if (__DEV__ && typeof window !== "undefined") {
      console.info("New pageview", window.location.href)
    }
  }

  render() {
    return (
      <div>
        { this.props.children }
        <GoogleAnalyticsInitiailizer />
      </div>
    )
  }
}

GoogleAnalyticsTracker.propTypes = {
  children: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
  params: PropTypes.object.isRequired,
}

GoogleAnalyticsTracker.contextTypes = {
  metadata: PropTypes.object.isRequired,
}

export default GoogleAnalyticsTracker
