import React, {Component, PropTypes} from "react"

export default class Post extends Component {

  static displayName = "Post"

  static propTypes = {
    title: PropTypes.string.isRequired,
    contents: PropTypes.string.isRequired,
  }
  render() {
    return (
      <div>
        <h1>
          {this.props.title}
        </h1>
        <div
          dangerouslySetInnerHTML={{__html: this.props.contents}}
        />
      </div>
    )
  }
}
