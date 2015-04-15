import React, {Component} from "react"

import Header from "../Header"

class Body extends Component {
  render() {
    return (
      <body>
        <Header/>
        <div className="putainde-Main">
          {this.props.children}
        </div>
      </body>
    )
  }
}

export default Body
