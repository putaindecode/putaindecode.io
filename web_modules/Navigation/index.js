import React, { Component, PropTypes } from "react"
import { Link } from "react-router"
import cx from "classnames"

import getI18n from "i18n/get"
import SVGIcon from "../SVGIcon"

const SVGs = {
  bookmark: require("icons/bookmark.svg"),
  textFile: require("icons/text-file.svg"),
  pencil: require("icons/pencil.svg"),
  github: require("icons/github.svg"),
  twitter: require("icons/twitter.svg"),
  chat: require("icons/chat.svg"),
}

export default class Navigation extends Component {

  static contextTypes = {
    metadata: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }

  render() {
    const i18n = getI18n(this.context)
    const home = this.context.location.pathname === "/"

    return (
      <nav className="putainde-Nav">
        {
          home &&
            [
              <Link to={ "/en/"} className={ "putainde-Nav-item" }>
                { "English" }
              </Link>,
              <Link to={ "/fr/"} className={ "putainde-Nav-item" }>
                { "Français" }
              </Link>,
            ]
        }
        {
          !home &&
          i18n.navigation.map((item) => (
            <Link to={item.url}
              key={item.url}
              className={ "putainde-Nav-item" }
              activeClassName={ "putainde-Nav-item--current" }
            >
              {
                item.icon &&
                <SVGIcon
                  className="putainde-Icon"
                  svg={SVGs[item.icon]}
                  cleanup
                />
              }
              {item.name}
            </Link>
          ))
        }
        {
          [ "github", "twitter", "chat" ].map((key) => (
            <a href={i18n[key]}
              key={i18n[key]}
              className={cx({
                "putainde-Nav-item": true,
                "putainde-Nav-item--icon": true,
                "r-Tooltip": true,
                "r-Tooltip r-Tooltip--bottom": true,
              })}
              data-r-tooltip={i18n[key + "Label"]}
            >
              <SVGIcon
                className="putainde-Icon"
                svg={ SVGs[key] }
                cleanup
              />
            </a>
          ))
        }
      </nav>
    )
  }
}
