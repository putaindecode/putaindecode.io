import React, {Component, PropTypes} from "react"

export default class Html extends Component {

  static displayName = "Html"

  static propTypes = {
      children: PropTypes.array.isRequired,
  }

  render() {
    return (
      <html lang="fr" className="r-VerticalRhythm">
        {this.props.children}
      </html>
    )
  }
}
