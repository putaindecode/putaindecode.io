import React, {Component} from "react"

class Html extends Component {
  render() {
    return (
      <html lang="fr" className="r-VerticalRhythm">
        {this.props.children}
      </html>
    )
  }
}

export default Html
