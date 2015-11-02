import React, { Component, PropTypes } from "react"
import { Link } from "react-router"

import cx from "classnames"

import SVGIcon from "../SVGIcon"

const SVGs = {
  bookmark: require("icons/bookmark.svg"),
  textFile: require("icons/text-file.svg"),
  pencil: require("icons/pencil.svg"),
  github: require("icons/github.svg"),
  twitter: require("icons/twitter.svg"),
  slack: require("icons/slack.svg"),
}

export default class Navigation extends Component {

  static contextTypes = {
    metadata: PropTypes.object.isRequired,
  }

  render() {
    const { metadata } = this.context
    const i18n = metadata.i18n

    return (
      <nav className="putainde-Nav">
        {
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
          i18n.navigationSocial.map((item) => (
            <a href={item.url}
              key={item.url}
              className={cx({
                "putainde-Nav-item": true,
                "putainde-Nav-item--icon": true,
                "r-Tooltip": true,
                "r-Tooltip r-Tooltip--bottom": true,
              })}
              data-r-tooltip={item.title}
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
            </a>
          ))
        }
      </nav>
    )
  }
}
