import React, { Component, PropTypes } from "react"

export default class NotFound extends Component {

  static contextTypes = {
    metadata: PropTypes.object.isRequired,
  }

  render() {
    const { metadata } = this.context
    const i18n = metadata.i18n
    return (
      <div className="r-Grid putainde-Post">
        <div className="r-Grid-cell r-all--9of12">
          <div className="putainde-NotFound">
            <div className="putainde-NotFound-title">
              {i18n.error404.title}
            </div>
            <div className="putainde-NotFound-subtitle">
                {i18n.error404.label}
              <br/>
              {" Si vous pensez que c’est une erreur, n’hésitez pas à "}
              <a
                className="putainde-NotFound-link" href={i18n.error404.url}
              >
                {" nous le signaler "}
              </a>
              <div className="putainde-NotFound-media">
                <img
                  width="100%"
                  src="http://www.reactiongifs.com/r/sywht1.gif"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
