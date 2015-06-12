import React, {Component, PropTypes} from "react"
import cx from "classnames"

import SVGIcon from "../SVGIcon"
import requireRaw from "../requireRaw"

export default class Navigation extends Component {

  static contextTypes = {
    file: PropTypes.object,
    i18n: PropTypes.object,
  }

  render() {
    const currentPage = "/" + this.context.file.url

    return (
      <nav className="putainde-Nav">
        {
          this.context.i18n.navigation.map((item) => {
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
                    svg={requireRaw(`content/${item.icon}`)}
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
