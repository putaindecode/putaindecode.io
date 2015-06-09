import React, {Component, PropTypes} from "react"

import Navigation from "../Navigation"
import SVGIcon from "../SVGIcon"
import requireRaw from "../requireRaw"

export default class Header extends Component {

  static displayName = "Header"

  static contextTypes = {
    i18n: PropTypes.object,
  }

  render() {
    return (
      <div className="putainde-Header">
        <div className="r-Grid">
          <div className="r-Grid-cell r-minM--1of3">
            <a className="putainde-SiteTitle" href="/">
              <SVGIcon
                className="putainde-Logo"
                svg={requireRaw("content/images/p!-logo.svg")}
                cleanupExceptions={["fill"]}
              />
              <span>{this.context.i18n.title}</span>
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
