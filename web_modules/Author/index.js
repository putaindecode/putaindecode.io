import React, { Component, PropTypes } from "react"

import getLang from "i18n/getLang"
import getI18n from "i18n/get"
import SVGIcon from "../SVGIcon"
import Avatar from "../Avatar"

import getAuthorUri from "../getAuthorUri"

export default class Author extends Component {

  static contextTypes = {
    metadata: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }

  static propTypes = {
    author: PropTypes.string.isRequired,
    className: PropTypes.string,
    afterName: PropTypes.string,
    isPost: PropTypes.bool,
    bio: PropTypes.bool,
  }

  static defaultProps = {
    bio: true,
  }

  render() {
    const i18n = getI18n(this.context)
    const locale = getLang(this.context)
    const { metadata } = this.context
    const {
      afterName,
      isPost,
      bio,
    } = this.props

    const author = metadata.contributors.getContributor(this.props.author)

    return (
      <div className={`putainde-Author ${this.props.className}`}>

        <Avatar
          author={author.login}
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
                href={getAuthorUri(author)}
              >
                { author.login }
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
                author.url &&
                <a
                  href={getAuthorUri(author)}
                  className="r-Tooltip r-Tooltip--top"
                  data-r-tooltip="Website"
                >
                  <SVGIcon
                    className="putainde-Icon"
                    svg={require(`icons/home.svg`)}
                    cleanup
                  />
                </a>
              }
              {
                author.twitter &&
                <a
                  href={getAuthorUri(author, "twitter")}
                  className="r-Tooltip r-Tooltip--top"
                  data-r-tooltip="Twitter"
                >
                  <SVGIcon
                    className="putainde-Icon"
                    svg={require(`icons/twitter.svg`)}
                    cleanup
                  />
                </a>
              }
              {
                author.login &&
                <a
                  href={getAuthorUri(author, "github")}
                  className="r-Tooltip r-Tooltip--top"
                  data-r-tooltip="Github"
                >
                  <SVGIcon
                    className="putainde-Icon"
                    svg={require(`icons/github.svg`)}
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
                  author[locale] && author[locale].bio &&
                  author[locale].bio.long
                ) &&
                author[locale].bio.long
                /* @todo add new lines between lines */
              }
            </p>
          }
        </div>
      </div>
    )
  }
}
