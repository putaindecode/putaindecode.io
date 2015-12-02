import React, { Component, PropTypes } from "react"
import DisqusThread from "react-disqus-thread"

import getI18n from "i18n/get"
import Author from "Author"
import Contributors from "Contributors"
import WithHeroHeader from "Layout/WithHeroHeader"

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
    location: PropTypes.object.isRequired,
  }

  render() {
    const i18n = getI18n(this.context)
    const { metadata } = this.context

    const {
      head,
      body,
    } = this.props

    const post = head

    return (
      <WithHeroHeader { ...this.props }>
        <div className="r-Grid">
          <div className="r-Grid-cell r-minM--8of12 putainde-Post-contents">
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

            </footer>

            {
              post.comments &&
              <DisqusThread
                shortname={i18n.disqus.id}
                identifier={metadata.pkg.homepage + this.props.__url}
                url={metadata.pkg.homepage + this.props.__url}
              />
            }

          </div>
        </div>
      </WithHeroHeader>
    )
  }
}
