import React, { PropTypes } from "react"
import cx from "classnames"
import { Link } from "react-router"

import getI18n from "../i18n/get"
import SVGInline from "react-svg-inline"

const SVGs = {
  github: require("../icons/github.svg"),
  twitter: require("../icons/twitter.svg"),
  facebook: require("../icons/facebook.svg"),
  chat: require("../icons/chat.svg"),
}

const Footer = ({}, context) => {
  const i18n = getI18n(context)

  return (
    <div className="putainde-Footer">
      <div className="r-Grid">

        <div className="r-Grid-cell r-minM--1of4">
          <p className="putainde-Footer-text">
            {i18n.copyright.replace("{*}", new Date().getFullYear())}
          </p>
        </div>

        <div className="r-Grid-cell r-minM--2of4">
          {
            i18n.footerNavigation &&
            <ul className="putainde-Footer-list">
              {
                i18n.footerNavigation.map((item) => {
                  return (
                    <li key={ item.url }>
                      <a href={ item.url }>
                        { item.name }
                      </a>
                    </li>
                  )
                })
              }
              {
                [ "github", "twitter", "facebook", "chat" ].map((key) => (
                  i18n[key] &&
                  <li key={i18n[key]}>
                    <a href={i18n[key]}
                      className="r-Tooltip r-Tooltip--top"
                      data-r-tooltip={i18n[key + "Label"]}
                    >
                      <SVGInline
                        className="putainde-Icon"
                        svg={ SVGs[key] }
                        cleanup
                      />
                    </a>
                  </li>
                ))
              }
            </ul>
          }
        </div>

        <div className="r-Grid-cell r-minM--1of4 putainde-Footer-text--right">
          <span
            className={cx(
              "putainde-Footer-text",
              "putainde-Footer-text--small"
            )}
          >
            <Link to={ "/en/" }>
              { "English" }
            </Link>
            { " | " }
            <Link to={ "/fr/" }>
              { "Français" }
            </Link>
          </span>
        </div>

      </div>
    </div>
  )
}

Footer.contextTypes = {
  metadata: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default Footer
