import React, {Component, PropTypes} from "react"
import cx from "classnames"

export default class Navigation extends Component {

  static contextTypes = {
    file: PropTypes.object,
    i18n: PropTypes.object,
  }

  items = [
    {
      url: "posts",
      name: "Articles",
      icon: "icons/bookmark.svg",
    },
    {
      url: "c-est-quoi-putaindecode",
      name: "Readme",
      icon: "icons/text-file.svg",
    },
    {
      url: "posts/comment-contribuer",
      name: "Participer",
      icon: "icons/pencil.svg",
    },
    {
      url: "https://github.com/putaindecode/",
      title: "GitHub",
      icon: "icons/github.svg",
    },
    {
      url: "https://twitter.com/putaindecode/",
      title: "Twitter",
      icon: "icons/twitter.svg",
    },
  ]

  render() {
    const currentPage = this.context.file._filename

    return (
      <nav className="putainde-Nav">
        {
          this.items.map((item) => {
            const isActivePage = currentPage === item.url || currentPage === item.url + "/index.html"

            return (
              <a
                key={item.url}
                className={cx({
                  "putainde-Nav-item": true,
                  "putainde-Nav-item--current": isActivePage,
                  "putainde-Nav-item--icon r-Tooltip r-Tooltip--bottom": item.title,
                })}
                href={`/${item.url}`}
                data-r-tooltip={item.title ? item.title : ""}
              >
                {/* @todo handle item.icon */}
                {
                  item.icon &&
                  <img className="putainde-Icon" src={`/${item.icon}`} alt="" />
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
