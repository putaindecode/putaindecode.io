import React, { Component, PropTypes } from "react"
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
    console.log("TODO currentPage")
    const currentPage = "/" // this.context.file.url

    return (
      <nav className="putainde-Nav">
        {
          i18n.navigation.map((item) => {
            const isActivePage =
              currentPage === item.url ||
              currentPage === item.url + "/" ||
              currentPage === item.url + "/index.html"
            const hasTooltip = item.title

            return (
              <a
                key={item.url}
                className={cx({
                  "putainde-Nav-item": true,
                  "putainde-Nav-item--current": isActivePage,
                  "putainde-Nav-item--icon": hasTooltip,
                  "r-Tooltip": hasTooltip,
                  "r-Tooltip r-Tooltip--bottom": hasTooltip,
                })}
                href={item.url}
                data-r-tooltip={hasTooltip ? item.title : ""}
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
            )
          })
        }
      </nav>
    )
  }
}
