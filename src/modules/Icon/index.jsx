import React, {Component, PropTypes} from "react"

export default class Icon extends Component {

  static propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
  }

  render() {
    return (
      <img
        className="putainde-Icon"
        src={this.props.src}
        alt={this.props.alt}
      />
    )
  }
}
