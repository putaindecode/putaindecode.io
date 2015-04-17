import React, {Component, PropTypes} from "react"

export default class DefaultTemplate extends Component {

  static displayName = "DefaultTemplate"

  static propTypes = {
    metas: PropTypes.string.isRequired,
    contributors: PropTypes.object.isRequired,
    collections: PropTypes.object.isRequired,
    file: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired,
  }

  static childContextTypes = {
    metas: PropTypes.string.isRequired,
    contributors: PropTypes.object.isRequired,
    collections: PropTypes.object.isRequired,
    file: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired,
  }

  getChildContext() {
    return {
      metas: this.props.metas,
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
