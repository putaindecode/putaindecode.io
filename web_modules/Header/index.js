import React, { Component, PropTypes } from "react"

import Navigation from "../Navigation"
import SVGIcon from "../SVGIcon"

export default class Header extends Component {

  static contextTypes = {
    metadata: PropTypes.object.isRequired,
  }

  render() {
    const { metadata } = this.context
    const i18n = metadata.i18n

    return (
      <div className="putainde-Header">
        <div className="r-Grid">
          <div className="r-Grid-cell r-minM--1of3">
            <a className="putainde-SiteTitle" href="/">
              <SVGIcon
                className="putainde-Logo"
                svg={require("images/putaindecode-logo.svg")}
                cleanupExceptions={[ "fill" ]}
              />
              <span>{i18n.title}</span>
            </a>
          </div>
          <div className="r-Grid-cell r-minM--2of3">
            <Navigation />
          </div>
        </div>
      </div>
    )
  }
}
