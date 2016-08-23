import React, { PropTypes } from "react"

import getLang from "../i18n/getLang"
import getI18n from "../i18n/get"
import SVGInline from "react-svg-inline"
import Avatar from "../Avatar"

import getAuthorUri from "../getAuthorUri"

const Author = ({ afterName, author, bio, className, isPost }, context) => {
  const i18n = getI18n(context)
  const locale = getLang(context)
  const authorData = context.metadata.contributors.getContributor(author)

  return (
    <div className={`putainde-Author ${className}`}>

      <Avatar
        author={authorData.login}
        className="putainde-Author-picture"
      />

      <div className="putainde-Author-description">
        <div className="putainde-Author-title">
          <h3 className="putainde-Author-name">
            {
              isPost &&
              <span className="putainde-WrittenBy">
                {`${i18n.writtenBy} `}
              </span>
            }
            <a
              className="putainde-Link"
              href={getAuthorUri(authorData)}
            >
              { authorData.login }
            </a>
            {
              afterName &&
              <span className="putainde-Author-afterName">
                {` ${afterName}`}
              </span>
            }
          </h3>

          <div className="putainde-Author-social">
            {
              authorData.url &&
              <a
                href={getAuthorUri(authorData)}
                className="r-Tooltip r-Tooltip--top"
                data-r-tooltip="Website"
              >
                <SVGInline
                  className="putainde-Icon"
                  svg={require("../icons/home.svg")}
                  cleanup
                />
              </a>
            }
            {
              authorData.twitter &&
              <a
                href={getAuthorUri(authorData, "twitter")}
                className="r-Tooltip r-Tooltip--top"
                data-r-tooltip="Twitter"
              >
                <SVGInline
                  className="putainde-Icon"
                  svg={require("../icons/twitter.svg")}
                  cleanup
                />
              </a>
            }
            {
              authorData.login &&
              <a
                href={getAuthorUri(authorData, "github")}
                className="r-Tooltip r-Tooltip--top"
                data-r-tooltip="Github"
              >
                <SVGInline
                  className="putainde-Icon"
                  svg={require("../icons/github.svg")}
                  cleanup
                />
              </a>
            }
          </div>
        </div>

        {
          bio &&
          <p className="putainde-Author-bio">
            {
              (
                authorData[locale] && authorData[locale].bio &&
                authorData[locale].bio.long
              ) &&
              authorData[locale].bio.long
              /* @todo add new lines between lines */
            }
          </p>
        }
      </div>
    </div>
  )
}

Author.contextTypes = {
  metadata: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

Author.propTypes = {
  author: PropTypes.string.isRequired,
  afterName: PropTypes.string,
  bio: PropTypes.bool,
  className: PropTypes.string,
  isPost: PropTypes.bool,
}

Author.defaultProps = {
  bio: true,
}

export default Author
