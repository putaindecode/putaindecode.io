import React, { PropTypes } from "react"
import Helmet from "react-helmet"

const Page = ({ head, body, __url }, { metadata }) => (
  <div className="putainde-Main">
    <Helmet
      title={ head.title }
      meta={ [
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
        { property: "og:title", content: head.title },
        { name: "twitter:title", content: head.title },
        { property: "og:description", content: head.description },
        { name: "twitter:description", content: head.description },
        { property: "og:url", content: metadata.pkg.homepage + __url },
        // { property: "og:image", content: header.image },
        // { name: "twitter:image", content: header.image },
      ] }
    />
    <article className="r-Grid putainde-Post">
      <div className="r-Grid-cell r-minM--8of12 putainde-Post-contents">

        {
          head.title &&
          <div className="putainde-Title">
            <h1 className="putainde-Title-text">
              {head.title}
            </h1>
          </div>
        }

        {
          !body &&
          <div
            style={ {
              fontSize: "3rem",
              color: "#ccc",
              margin: "20vh auto",
              textAlign: "center",
            } }
          >
            { "TODO :)" }
          </div>
        }
        {
          body &&
          <div className="putainde-Post-md"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        }

      </div>
    </article>
  </div>
)

Page.propTypes = {
  __url: PropTypes.string.isRequired,
  head: PropTypes.object.isRequired,
  body: PropTypes.string.isRequired,
}

Page.contextTypes = {
  metadata: PropTypes.object.isRequired,
}

export default Page
