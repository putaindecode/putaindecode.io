import React, { PropTypes } from "react"
import DisqusThread from "react-disqus-thread"

import getI18n from "../../i18n/get"
import Author from "../../Author"
import Contributors from "../../Contributors"
import WithHeroHeader from "../WithHeroHeader"

const Post = (props, context) => {
  const i18n = getI18n(context)
  const { metadata } = context
  const { body, head } = props
  const post = head

  return (
    <WithHeroHeader { ...props }>
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

            <Contributors
              filename={props.__filename}
              reviewers={post.reviewers}
            />

          </footer>

          {
            post.comments &&
            <DisqusThread
              shortname={i18n.disqus.id}
              identifier={metadata.pkg.homepage + props.__url}
              url={metadata.pkg.homepage + props.__url}
            />
          }

        </div>
      </div>
    </WithHeroHeader>
  )
}

Post.propTypes = {
  __url: PropTypes.string.isRequired,
  __filename: PropTypes.string.isRequired,
  head: PropTypes.object.isRequired,
  body: PropTypes.string.isRequired,
  rawBody: PropTypes.string.isRequired,
}

Post.contextTypes = {
  metadata: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default Post
