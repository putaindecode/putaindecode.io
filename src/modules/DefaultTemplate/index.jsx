import React, {PropTypes, Component} from "react"

export default class DefaultTemplate extends Component {

  static displayName = "DefaultTemplate"

  static propTypes = {
    contributors: PropTypes.object.isRequired,
    collections: PropTypes.object.isRequired,
    file: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired,
  }

  static childContextTypes = {
    contributors: PropTypes.object.isRequired,
    collections: PropTypes.object.isRequired,
    file: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired,
  }

  getChildContext() {
    return {
      contributors: this.props.contributors,
      collections: this.props.collections,
      file: this.props.file,
      i18n: this.props.i18n,
    }
  }

  render() {
    return (
      <div>
        <h1>
          {this.props.file.title}
        </h1>
        <div
          dangerouslySetInnerHTML={{__html: this.props.file.contents}}
        />
      </div>
    )
  }
}
