import React, {PropTypes} from "react"
import cx from "classnames"

import DefaultTemplate from "../Default"

import Html from "../../modules/Html"
import Head from "../../modules/Head"
import Body from "../../modules/Body"
import AuthorsList from "../../modules/AuthorsList"
import Author from "../../modules/Author"
import Contributors from "../../modules/Contributors"
import formatDate from "../../modules/formatDate"
import ReadingTime from "../../modules/ReadingTime"

export default class Post extends DefaultTemplate {

  static displayName = "Post"

  // should not be declared here too, only in parent class
  // https://github.com/yannickcr/eslint-plugin-react/issues/68
  static propTypes = {
    pkg: PropTypes.object.isRequired,
    metadata: PropTypes.object.isRequired,
    contributors: PropTypes.object.isRequired,
    collections: PropTypes.object.isRequired,
    file: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired,
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

    // default to just the image
    const backgrounds = {
      // "" => no need for prefix, see trick below
      "": [
        [
          `url("${image}")`,
          "no-repeat 50% 50% / cover",
        ],
      ],
    }

    // if there is a modification that need some prefix, we use a trick
    if (metadata.linearGradient || metadata.radialGradient) {
      const prefixes = ["", "-webkit-"]
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
            `url("${image}")`,
            "no-repeat 50% 50% / cover",
          ])
        }
        backgrounds[prefix] = background
      })
    }

    return {
      backgroundColor: metadata.color || "#c33",
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
        (metadata.color ? metadata.color + " " : "") +
        backgrounds[""].map(bg => `${bg[0]} ${bg[1]}`).join(", ")
      ),
      filter: metadata.filter,
    }
  }

  render() {
    const i18n = this.props.i18n
    const file = this.props.file

    // we want original filename
    const filename = file.filename

    var twitterAuthor =
      this.props.file.authors &&
      this.props.file.authors.length
      ?
        this.props.contributors.map[this.props.file.authors[0]].twitter
        :
        this.props.i18n.twitterUsername
    return (
      <Html>
        <Head
          title={this.props.file.title}
          stylesheets={this.props.metadata.assets.stylesheets}
        >
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content={`@${i18n.twitterUsername}`} />
          <meta name="twitter:title" content={this.props.file.title} />
          <meta name="twitter:creator" content={`@${twitterAuthor}`} />

          <meta property="og:title" content={file.title} />
          <meta property="og:type" content="article" />
          <meta property="og:site_name" content={i18n.title} />
        </Head>
        <Body
          scripts={this.props.metadata.assets.scripts}
        >
          <article
            className={cx({
              "putainde-Post": true,
              "putainde-Post--customHeader": file.header,
            })}
          >
            <header>
              <div
                className={cx({
                  "putainde-Post-header": true,
                  "putainde-Post-header--custom": file.header,
                  "putainde-Post-header--filter":
                    file.header && file.header.filter,
                  "putainde-Post-header--dark":
                    file.header && !file.header.light,
                    "putainde-Post-header--light":
                      file.header && file.header.light,
                })}
              >
                {
                  file.header &&
                  <div
                    className="putainde-Post-header-picture"
                    style={Post.renderCSSBackground(file.header)}
                  >
                  </div>
                }
                {
                  file.header && file.header.credit &&
                  <a
                    className="putainde-Post-header-pictureCredit"
                    href={file.header.credit}
                  >
                    Crédit photo
                  </a>
                }
                {
                  file.title &&
                  <h1 className="putainde-Title">
                    {file.title}
                  </h1>
                }
              </div>
              {
                (file.authors || file.date) &&
                <div className="putainde-Post-metas">
                  {
                    (file.authors && file.authors.length) &&
                    <span>
                      {`${i18n.writtenBy} `}
                      <AuthorsList authors={file.authors} />
                    </span>
                  }
                  {
                    (file.authors && file.authors.length && file.date) &&
                    <span>{", "}</span>
                  }
                  {
                    file.date &&
                    <span className="putainde-Date">
                      {` ${i18n.the} ${formatDate(file.date)}`}
                    </span>
                  }
                  {". "}

                  <ReadingTime
                    text={file.contents.toString()}
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
                file.tags &&
                <ul className="putainde-Tags putainde-Post-tags">
                {
                  file.tags.map(tag => (
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
                    dangerouslySetInnerHTML={{__html: file.contents}}
                  />
                </div>

                <footer className="putainde-Post-footer">

                  {
                    file.authors && file.authors.length === 1 &&
                    <div>
                      <Author author={file.authors[0]} isPost={true} />
                    </div>
                  }
                  {
                    file.authors && file.authors.length > 1 &&
                    <div>
                      <h3 className="putainde-WrittenBy">{i18n.writtenBy}</h3>
                      {
                        file.authors &&
                        file.authors.map(
                          author => <Author key={author} author={author} />
                        )
                      }
                    </div>
                  }

                  <Contributors filename={filename} />

                  <div id="disqus_thread" aria-live="polite">
                    <noscript>
                      {"Please enable JavaScript to view the "}
                      <a
                        href="http://disqus.com/?ref_noscript"
                      >
                        comments powered by Disqus.
                      </a>
                    </noscript>
                  </div>

                </footer>

              </div>
            </div>

          </article>
        </Body>
      </Html>
    )
  }
}
