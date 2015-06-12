import React, {PropTypes} from "react"
import cx from "classnames"
import DefaultTemplate from "../Default"

import Html from "../../modules/Html"
import Head from "../../modules/Head"
import Body from "../../modules/Body"
import PostsList from "../../modules/PostsList"

export default class Posts extends DefaultTemplate {

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
    const posts = this.props.collections.posts.filter(
      (v, i) => typeof i === "number"
    )

    return (
      <Html>
        <Head
          title={this.props.file.title}
          stylesheets={this.props.metadata.assets.stylesheets}
        />
        <Body
          scripts={this.props.metadata.assets.scripts}
        >
          <div className="r-Grid putainde-Section">
            <div
              className={cx(
                "r-Grid-cell",
                "r-all--8of12",
                "putainde-Section-contents",
                "js-Posts"
              )}
            >
              <div className="putainde-Title putainde-Title--home">
                <h2 className="putainde-Title-text">
                  {this.props.file.title}
                </h2>
              </div>
              <PostsList posts={posts} />
            </div>
          </div>
        </Body>
      </Html>
    )
  }
}
