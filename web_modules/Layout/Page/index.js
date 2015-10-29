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
          <div className="r-Grid-cell r-all--8of12 putainde-Post-contents">

            {
              head.title &&
              <div className="putainde-Title">
                <h1 className="putainde-Title-text">
                  {head.title}
                </h1>
              </div>
            }

            <div className="putainde-Post-md"
              dangerouslySetInnerHTML={{ __html: body }}
            />

          </div>
        </article>
      </div>
    )
  }
}
