import React, {PropTypes, Component} from "react"

import Navigation from "../Navigation"

export default class extends Component {

  static contextTypes = {
    i18n: PropTypes.object,
  }

  render() {
    return (
      <div className="putainde-Header">
        <div className="r-Grid">
          <div className="r-Grid-cell r-all--5of12">
            <a className="putainde-SiteTitle" href="/">
              <img
                className="putainde-Logo"
                alt={this.context.i18n.title}
                src="/images/p!-logo.svg"
              />
              <span>{this.context.i18n.title}</span>
            </a>
          </div>
          <div className="r-Grid-cell r-all--7of12">
            <Navigation />
          </div>
        </div>
      </div>
    )
  }
}
