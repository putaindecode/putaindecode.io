import React, { PropTypes } from "react";
import Helmet from "react-helmet";
import DisqusThread from "react-disqus-thread";
import { BodyContainer } from "phenomic";

import Loading from "../../components/Loading";
import getI18n from "../../i18n/get";
import Author from "../../components/Author";
import Contributors from "../../components/Contributors";
import WithHeroHeader from "../WithHeroHeader";

const Post = (props, context) => {
  const i18n = getI18n(context);
  const { metadata } = context;
  const { isLoading, body, head, __url } = props;
  const post = head;

  const twitterAuthor =
    post.authors && post.authors.length
      ? metadata.contributors.getContributor(post.authors[0]).twitter
      : i18n.twitterUsername;

  return (
    <WithHeroHeader {...props}>
      <Helmet
        title={post.title}
        meta={[
          { property: "og:type", content: "article" },
          { name: "twitter:card", content: "summary" },
          { property: "og:title", content: head.title },
          { name: "twitter:title", content: head.title },
          { property: "og:description", content: head.description },
          { name: "twitter:description", content: head.description },
          { property: "og:url", content: metadata.pkg.homepage + __url },
          // { property: "og:image", content: header.image },
          // { name: "twitter:image", content: header.image },

          { name: "twitter:creator", content: `@${twitterAuthor}` }
        ]}
      />
      <div className="r-Grid">
        <div className="r-Grid-cell r-minM--8of12 putainde-Post-contents">
          <div className="putainde-Post-md">
            {isLoading ? <Loading /> : <BodyContainer>{body}</BodyContainer>}
          </div>

          <footer className="putainde-Post-footer">
            {post.authors &&
              post.authors.length === 1 && (
                <div>
                  <Author author={post.authors[0]} isPost />
                </div>
              )}
            {post.authors &&
              post.authors.length > 1 && (
                <div>
                  <h3 className="putainde-WrittenBy">{i18n.writtenBy}</h3>
                  {post.authors &&
                    post.authors.map(author => (
                      <Author key={author} author={author} />
                    ))}
                </div>
              )}

            <Contributors
              filename={props.__filename}
              reviewers={post.reviewers}
            />
          </footer>

          {post.comments && (
            <DisqusThread
              shortname={i18n.disqus.id}
              identifier={metadata.pkg.homepage + props.__url}
              url={metadata.pkg.homepage + props.__url}
            />
          )}
        </div>
      </div>
    </WithHeroHeader>
  );
};

Post.propTypes = {
  __url: PropTypes.string.isRequired,
  __filename: PropTypes.string.isRequired,
  isLoading: PropTypes.boolean,
  head: PropTypes.object.isRequired,
  body: PropTypes.string.isRequired,
  rawBody: PropTypes.string.isRequired
};

Post.contextTypes = {
  metadata: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export default Post;
