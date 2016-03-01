import React, { PropTypes } from "react"
import { Link } from "react-router"
import cx from "classnames"

import getI18n from "../i18n/get"
import SVGIcon from "../SVGIcon"

const SVGs = {
  bookmark: require("../icons/bookmark.svg"),
  textFile: require("../icons/text-file.svg"),
  pencil: require("../icons/pencil.svg"),
  github: require("../icons/github.svg"),
  twitter: require("../icons/twitter.svg"),
  facebook: require("../icons/facebook.svg"),
  chat: require("../icons/chat.svg"),
}

import styles from "./styles.css"

const Navigation = ({}, context) => {
  const i18n = getI18n(context)
  return (
    <nav className={ styles.nav }>
      {
        i18n.navigation.map((item) => (
          <Link to={item.url}
            key={item.url}
            className={ styles.item }
            activeClassName={ styles.itemCurrent }
          >
            {
              item.icon &&
              <SVGIcon
                className="putainde-Icon"
                svg={ SVGs[item.icon] }
                cleanup
              />
            }
            {item.name}
          </Link>
        ))
      }
      {
        [ "github", "twitter", "facebook", "chat" ].map((key) => (
          i18n[key] &&
          <a href={i18n[key]}
            key={i18n[key]}
            className={cx({
              [styles.item]: true,
              [styles.itemIcon]: true,
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

Navigation.contextTypes = {
  metadata: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default Navigation
