import React, { PropTypes } from "react"
import { Link } from "react-router"

import getI18n from "../i18n/get"
import getLang from "../i18n/getLang"
import Navigation from "../Navigation"
import SVGInline from "react-svg-inline"

const Header = ({}, context) => {
  const i18n = getI18n(context)

  return (
    <div className="putainde-Header">
      <div className="r-Grid">
        <div className="r-Grid-cell r-minM--1of3">
          <Link className="putainde-SiteTitle" to={`/${getLang(context)}/`}>
            <SVGInline
              className="putainde-Logo"
              svg={require("../images/putaindecode-logo.svg")}
              cleanupExceptions={[ "fill" ]}
            />
            <span>{i18n.title}</span>
          </Link>
        </div>
        <div className="r-Grid-cell r-minM--2of3">
          <Navigation />
        </div>
      </div>
    </div>
  )
}

Header.contextTypes = {
  metadata: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default Header
