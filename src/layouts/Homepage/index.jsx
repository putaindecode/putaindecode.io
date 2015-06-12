import React, {PropTypes} from "react"
import cx from "classnames"

import SVGIcon from "../../modules/SVGIcon"
import requireRaw from "../../modules/requireRaw"

import DefaultTemplate from "../Default"

import Html from "../../modules/Html"
import Head from "../../modules/Head"
import Body from "../../modules/Body"
import LatestPosts from "../../modules/LatestPosts"
import TopContributors from "../../modules/TopContributors"

export default class Homepage extends DefaultTemplate {

  // should not be declared here too, only in parent class
  // https://github.com/yannickcr/eslint-plugin-react/issues/68
  static propTypes = {
    metadata: PropTypes.object.isRequired,
    contributors: PropTypes.object.isRequired,
    collections: PropTypes.object.isRequired,
    file: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired,
  }

  render() {
    const i18n = this.props.i18n
    const latestPosts = this.props.collections.posts.slice(0, 6)

    return (
      <Html>
        <Head
          title={this.props.file.title}
          stylesheets={this.props.metadata.assets.stylesheets}
        >
          <meta name="description" content={i18n.description} />
        </Head>
        <Body
          scripts={this.props.metadata.assets.scripts}
        >
          <LatestPosts posts={latestPosts} />

          <div className="putainde-Section putainde-Section--manifesto">
            <div className="r-Grid r-Grid--alignCenter">
              <div
                className={cx(
                  "r-Grid-cell",
                  "r-all--8of12",
                  "putainde-Section-contents",
                  "putainde-Post-contents"
                )}
              >
                <div className="putainde-Title putainde-Title--home">
                  <h2 className="putainde-Title-text">{i18n.manifesto}</h2>
                </div>
                <div
                  dangerouslySetInnerHTML={{__html: this.props.file.contents}}
                />
                <div className="putainde-Networks">
                  <a
                    className="putainde-Network"
                    href={i18n.github}
                    title={i18n.githubLabel}
                  >
                    <SVGIcon
                      className="putainde-Icon"
                      svg={requireRaw(`content/icons/github.svg`)}
                      cleanup
                    />
                  </a>
                  {i18n.elsewhere}
                  <a
                    className="putainde-Network"
                    href={i18n.twitter}
                    title={i18n.twitterLabel}
                  >
                    <SVGIcon
                      className="putainde-Icon"
                      svg={requireRaw(`content/icons/twitter.svg`)}
                      cleanup
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <TopContributors />
        </Body>
      </Html>
    )
  }
}
