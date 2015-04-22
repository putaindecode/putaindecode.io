import React, {Component, PropTypes} from "react"

import Header from "../Header"
import Footer from "../Footer"
import Analytics from "../Analytics"

export default class Body extends Component {

  static displayName = "Body"

  static propTypes = {
    children: PropTypes.oneOfType(
      PropTypes.array,
      PropTypes.object
    ).isRequired,
  }

  render() {
    return (
      <body>

        <Header />

        <div className="putainde-Main">
          {this.props.children}
        </div>

        <Footer />

        <Analytics />

      </body>
    )
  }
}
