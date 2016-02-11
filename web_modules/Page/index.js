import React, { PropTypes } from "react"
import Helmet from "react-helmet"
import invariant from "invariant"

// function pageDescription(text) {
//   return text
// }

const Page = ({ body, children, head }) => {
  invariant(typeof head.title === "string", "Your page needs a title")

  const meta = [
    { name: "twitter:title", content: head.title },
    // { name: "twitter:description", content: pageDescription(body) },
    // { name: "twitter:image", content: header.image },
    { property: "og:title", content: head.title },
    { property: "og:type", content: "article" },
    // { property: "og:url", content: "http://www.example.com/" },
    // { property: "og:description", content: pageDescription(body) },
    // { property: "og:image", content: header.image },
  ]

  return (
    <div>
      <Helmet
        title={ head.title }
        meta={ meta }
      />

      <h1>{ head.title }</h1>
      {
        body &&
        <div
          dangerouslySetInnerHTML={ { __html: body } }
        />
      }
      { children }
    </div>
  )
}

Page.propTypes = {
  children: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
  head: PropTypes.object.isRequired,
  body: PropTypes.string.isRequired,
}

Page.contextTypes = {
  metadata: PropTypes.object.isRequired,
}

export default Page
