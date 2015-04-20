import React, {Component, PropTypes} from "react"

import Header from "../Header"

export default class Body extends Component {

  static displayName = "Body"

  static propTypes = {
  }

  render() {
    return (
      <body>
        <Header />
        <div className="putainde-Main">
          {this.props.children}
        </div>
      </body>
    )
  }
}
