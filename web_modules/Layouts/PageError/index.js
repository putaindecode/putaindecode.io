import React, { PropTypes } from "react"
import Helmet from "react-helmet"

import getI18n from "../../i18n/get"

const PageError = ({}, context) => {
  const i18n = getI18n(context)
  const { metadata } = context
  const httpRepository = metadata.pkg.repository.replace(/\.git$/, "")
  const title = i18n.PageError.title

  return (
    <div className="putainde-Main">
      <Helmet
        title={ title }
        meta={[
          { property: "og:title", content: title },
          { name: "twitter:title", content: title },
        ]}
      />
      <div className="r-Grid putainde-Post">
        <div className="r-Grid-cell r-minM--8of12">
          <div
            className="putainde-Post-contents"
            style={{ textAlign: "center" }}
          >
            {
              title &&
              <div className="putainde-Title">
                <h1 className="putainde-Title-text">
                  {title}
                </h1>
              </div>
            }

            <div
              style={{ margin: "2rem 0" }}
            >
              { i18n.PageError.contentMissing }
              <br />
              { i18n.PageError.report }
              <a
                href={
                  httpRepository +
                  "/issues/new?title=" +
                  "Page not found" +
                  "&body=" +
                  (
                    typeof window !== "undefined"
                    ? window.location.href
                    : ""
                  )
                }
              >
                  { i18n.PageError.reportLink }
              </a>
              <img
                alt=""
                src="http://www.reactiongifs.com/r/sywht1.gif"
                style={ {
                  width: "100%",
                  margin: "1rem auto",
                } }
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

PageError.defaultProps = {
  error: 404,
  errorText: "Page Not Found",
}

PageError.contextTypes = {
  metadata: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default PageError
