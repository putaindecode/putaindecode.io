import React, {Component, PropTypes} from "react"
import cx from "classnames"

import Icon from "../Icon"

export default class Footer extends Component {

  static displayName = "Footer"

  static contextTypes = {
    i18n: PropTypes.object,
  }

  render() {
    const i18n = this.context.i18n
    return (
      <div className="putainde-Footer">
        <div className="r-Grid">

          <div className="r-Grid-cell r-all--3of12">
            <p className="putainde-Footer-text">
              {i18n.copyright.replace("{*}", new Date().getFullYear())}
            </p>
          </div>

          <div className="r-Grid-cell r-all--6of12">
            {
              i18n.footerNavigation &&
              <ul className="putainde-Footer-list">
              {
                [
                  i18n.footerNavigation.map((item) => {
                    return (
                      <li key={item.url}>
                        <a href={item.url}>
                          {item.name}
                        </a>
                      </li>
                    )
                  }),
                  <li key={i18n.github}>
                    <a
                      href={i18n.github}
                      data-r-tooltip="GitHub"
                      className="r-Tooltip r-Tooltip--top"
                    >
                      <Icon src="/icons/github.svg" />
                    </a>
                  </li>,
                  <li key={i18n.twitter}>
                    <a
                      href={i18n.twitter}
                      data-r-tooltip="Twitter"
                      className="r-Tooltip r-Tooltip--top"
                    >
                      <Icon src="/icons/twitter.svg" />
                    </a>
                  </li>,
                ]
              }
              </ul>
            }
          </div>

          <div className="r-Grid-cell r-all--3of12">
            <p
              className={cx(
                "putainde-Footer-text",
                "putainde-Footer-text--small",
                "putainde-Footer-text--right"
              )}
            >
              {i18n.madeWithHeart}
            </p>
          </div>

        </div>
      </div>
    )
  }
}
