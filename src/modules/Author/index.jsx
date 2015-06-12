import React, {Component, PropTypes} from "react"

import SVGIcon from "../SVGIcon"
import requireRaw from "../requireRaw"
import Avatar from "../Avatar"

import getAuthorUri from "../getAuthorUri"

export default class Author extends Component {

  static contextTypes = {
    contributors: PropTypes.object,
    i18n: PropTypes.object,
  }

  static propTypes = {
    className: PropTypes.string,
    author: PropTypes.string.isRequired,
    afterName: PropTypes.string,
    isPost: PropTypes.bool,
  }

  render() {
    const i18n = this.context.i18n
    const author = this.context.contributors.getContributor(this.props.author)

    return (
      <div className={`putainde-Author ${this.props.className}`}>

        <Avatar
          author={author.login}
          className="putainde-Author-picture" />

        <div className="putainde-Author-description">
          <div className="putainde-Author-title">
            <h3 className="putainde-Author-name">
              {
                this.props.isPost &&
                <span className="putainde-WrittenBy">
                  {`${i18n.writtenBy} `}
                </span>
              }
              <a
                className="putainde-Link"
                href={getAuthorUri(author)}
              >
                {author.login}
              </a>
              {
                this.props.afterName &&
                <span className="putainde-Author-afterName">
                  {` ${this.props.afterName}`}
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
                    svg={requireRaw(`content/icons/home.svg`)}
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
                    svg={requireRaw(`content/icons/twitter.svg`)}
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
                    svg={requireRaw(`content/icons/github.svg`)}
                    cleanup
                  />
                </a>
              }
            </div>
          </div>

          <p className="putainde-Author-bio">
            {
              (author.fr && author.fr.bio && author.fr.bio.long) &&
              author.fr.bio.long
              /* @todo add new lines betwee lines */
            }
          </p>
        </div>
      </div>
    )
  }
}
