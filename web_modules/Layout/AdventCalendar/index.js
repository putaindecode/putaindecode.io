import React, { Component, PropTypes } from "react"

// import getI18n from "i18n/get"
import Contributors from "Contributors"
import WithHeroHeader from "Layout/WithHeroHeader"

export default class AdventCalendar extends Component {

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
    // const i18n = getI18n(this.context)
    // const { metadata } = this.context

    const {
      // head,
      body,
    } = this.props

    // const post = head

    return (
      <WithHeroHeader { ...this.props } meta={ false } tags={ false }>
        <div className="r-Grid">
          <div className="r-Grid-cell r-minM--8of12 putainde-Post-contents">
            <div className="putainde-Post-md">
              <div
                dangerouslySetInnerHTML={{ __html: body }}
              />
            </div>

            <footer className="putainde-Post-footer">

              <Contributors filename={this.props.__filename} />

            </footer>
          </div>
        </div>
      </WithHeroHeader>
    )
  }
}
