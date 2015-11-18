import React, { Component, PropTypes } from "react"
import cx from "classnames"

import getI18n from "i18n/get"
import SVGIcon from "../SVGIcon"

export default class Footer extends Component {

  static contextTypes = {
    metadata: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }

  render() {
    const i18n = getI18n(this.context)

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
                [
                  i18n.footerNavigation.map((item) => {
                    return (
                      <li key={ item.url }>
                        <a href={ item.url }>
                          { item.name }
                        </a>
                      </li>
                    )
                  }),
                  <li key={ i18n.forum }>
                    <a href={ i18n.forum }>
                      { i18n.forumLabel }
                    </a>
                  </li>,
                  <li key={i18n.github}>
                    <a
                      href={i18n.github}
                      data-r-tooltip={i18n.githubLabel}
                      className="r-Tooltip r-Tooltip--top"
                    >
                      <SVGIcon
                        className="putainde-Icon"
                        svg={require(`icons/github.svg`)}
                        cleanup
                      />
                    </a>
                  </li>,
                  <li key={i18n.twitter}>
                    <a
                      href={i18n.twitter}
                      data-r-tooltip={i18n.twitterLabel}
                      className="r-Tooltip r-Tooltip--top"
                    >
                      <SVGIcon
                        className="putainde-Icon"
                        svg={require(`icons/twitter.svg`)}
                        cleanup
                      />
                    </a>
                  </li>,
                  <li key={i18n.chat}>
                    <a
                      href={i18n.chat}
                      data-r-tooltip={i18n.chatLabel}
                      className="r-Tooltip r-Tooltip--top"
                    >
                      <SVGIcon
                        className="putainde-Icon"
                        svg={require(`icons/chat.svg`)}
                        cleanup
                      />
                    </a>
                  </li>,
                ]
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
              {i18n.madeWithHeart}
            </span>
          </div>

        </div>
      </div>
    )
  }
}
