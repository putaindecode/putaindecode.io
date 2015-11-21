import React, { Component, PropTypes } from "react"
import Helmet from "react-helmet"

export default class Page extends Component {

  static propTypes = {
    head: PropTypes.object.isRequired,
    body: PropTypes.string.isRequired,
  }

  static childContextTypes = {
    metadata: PropTypes.object.isRequired,
  }

  render() {
    const {
      head,
      body,
    } = this.props

    return (
      <div className="putainde-Main">
        <Helmet
          title={ head.title }
          meta={[
            { property: "og:title", content: head.title },
            { name: "twitter:title", content: head.title },
          ]}
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
  }
}
