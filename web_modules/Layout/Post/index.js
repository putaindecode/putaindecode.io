import React, { Component, PropTypes } from "react"
import cx from "classnames"
import Helmet from "react-helmet"
import DisqusThread from "react-disqus-thread"

import AuthorsList from "AuthorsList"
import Author from "Author"
import Contributors from "Contributors"
import formatDate from "formatDate"
import ReadingTime from "ReadingTime"

export default class Post extends Component {

  static propTypes = {
    __url: PropTypes.string.isRequired,
    __filename: PropTypes.string.isRequired,
    head: PropTypes.object.isRequired,
    body: PropTypes.string.isRequired,
    rawBody: PropTypes.string.isRequired,
  }

  static contextTypes = {
    metadata: PropTypes.object.isRequired,
  }

  // 2 cts autoprefixer
  static renderCSSBackground(metadata) {
    let image = metadata.image
    if (
      metadata.image === true ||
      (!metadata.image && metadata.credit)
    ) {
      image = "index.jpg"
    }

    const color = metadata.color || "#c33"

    // default to just the image
    const backgrounds = {
      // "" => no need for prefix, see trick below
      "": [
        [
          `${color} url("${image}")`,
          "no-repeat 50% 50% / cover",
        ],
      ],
    }

    // if there is a modification that need some prefix, we use a trick
    if (metadata.linearGradient || metadata.radialGradient) {
      const prefixes = [ "", "-webkit-" ]
      prefixes.forEach((prefix) => {
        const background = []
        if (metadata.linearGradient) {
          background.push([
            `${prefix}linear-gradient(${metadata.linearGradient})`,
            "repeat 0% 0%",
          ])
        }
        if (metadata.radialGradient) {
          background.push([
            `${prefix}radial-gradient(${metadata.linearGradient})`,
            "repeat 0% 0%",
          ])
        }
        // only need the image if there will be both prefixed and unprefixed
        // versions
        if (image) {
          background.push([
            `${color} url("${image}")`,
            "no-repeat 50% 50% / cover",
          ])
        }
        backgrounds[prefix] = background
      })
    }

    return {
      backgroundColor: color,
      // we can not handle a css fallback with the same property name
      // since a js object doesn't handle that like css rules set
      // so here is the 2cts trick
      // background-image + background-size AND background. Yep.
      ...(
        backgrounds["-webkit-"]
        ? {
          backgroundImage: backgrounds["-webkit-"].map(bg => bg[0]).join(", "),
          backgroundSize: backgrounds["-webkit-"].map(bg => bg[1]).join(", "),
        }
        : {}
      ),
      background: (
        backgrounds[""].map(bg => `${bg[0]} ${bg[1]}`).join(", ")
      ),
      filter: metadata.filter,
    }
  }

  render() {
    const { metadata } = this.context
    const i18n = metadata.i18n

    const {
      head,
      body,
      rawBody,
    } = this.props

    const post = head

    const twitterAuthor =
      post.authors && post.authors.length
      ? metadata.contributors.getContributor(post.authors[0]).twitter
      : i18n.twitterUsername

    return (
      <div className="putainde-Main">
        <Helmet
          title={ post.title }
          meta={[
            { property: "og:type", content: "article" },
            { property: "og:title", content: post.title },
            { name: "twitter:card", content: "summary" },
            { name: "twitter:title", content: post.title },
            { name: "twitter:creator", content: `@${ twitterAuthor }` },
          ]}
        />
        <article
          className={cx({
            "putainde-Post": true,
            "putainde-Post--customHeader": post.header,
          })}
        >
          <header>
            <div
              className={cx({
                "putainde-Post-header": true,
                "putainde-Post-header--custom": post.header,
                "putainde-Post-header--filter":
                  post.header && post.header.filter,
                "putainde-Post-header--dark":
                  post.header && !post.header.light,
                "putainde-Post-header--light":
                    post.header && post.header.light,
              })}
            >
              {
                post.header &&
                <div
                  className="putainde-Post-header-picture"
                  style={Post.renderCSSBackground(post.header)}
                >
                </div>
              }
              {
                post.header && post.header.credit &&
                <a
                  className="putainde-Post-header-pictureCredit"
                  href={post.header.credit}
                >
                  {"Crédit photo"}
                </a>
              }
              {
                post.title &&
                <h1 className="putainde-Title">
                  {post.title}
                </h1>
              }
            </div>
            {
              (post.authors || post.date) &&
              <div className="putainde-Post-metas">
                {
                  (post.authors && post.authors.length) &&
                  <span>
                    {`${i18n.writtenBy} `}
                    <AuthorsList authors={post.authors} />
                  </span>
                }
                {
                  (post.authors && post.authors.length && post.date) &&
                  <span>{", "}</span>
                }
                {
                  post.date &&
                  <span className="putainde-Date">
                    {` ${i18n.the} ${formatDate(post.date)}`}
                  </span>
                }
                {". "}

                <ReadingTime
                  text={rawBody}
                  before={i18n.readingTime}
                  templateText={{
                    1: i18n.readingTime1,
                    2: i18n.readingTime2,
                  }}
                  templateTooltip={i18n.readingTimeComment}
                  className="putainde-Post-readingTime"
                />
              </div>
            }
            {
              post.tags &&
              <ul className="putainde-Tags putainde-Post-tags">
              {
                post.tags.map(tag => (
                  <li key={tag} className="putainde-Tag">{tag}</li>
                ))
              }
              </ul>
            }
          </header>

          <div className="r-Grid">
            <div className="r-Grid-cell r-all--8of12 putainde-Post-contents">
              <div className="putainde-Post-md">
                <div
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              </div>

              <footer className="putainde-Post-footer">

                {
                  post.authors && post.authors.length === 1 &&
                  <div>
                    <Author author={post.authors[0]} isPost={true} />
                  </div>
                }
                {
                  post.authors && post.authors.length > 1 &&
                  <div>
                    <h3 className="putainde-WrittenBy">{i18n.writtenBy}</h3>
                    {
                      post.authors &&
                      post.authors.map(
                        author => <Author key={author} author={author} />
                      )
                    }
                  </div>
                }

                <Contributors filename={this.props.__filename} />

                {
                  post.comments &&
                  <DisqusThread
                    shortname={i18n.disqus.id}
                    identifier={metadata.pkg.homepage + this.props.__url}
                    url={metadata.pkg.homepage + this.props.__url}
                  />
                }

              </footer>

            </div>
          </div>

        </article>
      </div>
    )
  }
}
