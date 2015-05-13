import React, {PropTypes} from "react"
import cx from "classnames"
import DefaultTemplate from "../DefaultTemplate"

import Html from "../Html"
import Head from "../Head"
import Body from "../Body"
import PostsList from "../PostsList"

export default class Posts extends DefaultTemplate {

  static displayName = "Posts"

  // should not be declared here too, only in parent class
  // https://github.com/yannickcr/eslint-plugin-react/issues/68
  static propTypes = {
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
        <Head title={this.props.file.title} />
        <Body>
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
