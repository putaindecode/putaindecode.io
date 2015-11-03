import React, { Component, PropTypes } from "react"
import { Link } from "react-router"

import cx from "classnames"

import SVGIcon from "../SVGIcon"

export default class Footer extends Component {

  static contextTypes = {
    metadata: PropTypes.object.isRequired,
  }

  render() {
    const { metadata } = this.context
    const i18n = metadata.i18n

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
                      <li key={item.url}>
                        <Link to={item.url}>
                          {item.name}
                        </Link>
                      </li>
                    )
                  }),
                  <li key={i18n.forum}>
                    <Link to={i18n.forum}>
                      {i18n.forumLabel}
                    </Link>
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
                  <li key={i18n.slack}>
                    <a
                      href={i18n.slack}
                      data-r-tooltip={i18n.slackLabel}
                      className="r-Tooltip r-Tooltip--top"
                    >
                      <SVGIcon
                        className="putainde-Icon"
                        svg={require(`icons/slack.svg`)}
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
