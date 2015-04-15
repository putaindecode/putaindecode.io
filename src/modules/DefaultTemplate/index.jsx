import React, {PropTypes, Component} from "react"

class DefaultTemplate extends Component {

  static displayName = "DefaultTemplate"

  static contextTypes = {
    file: PropTypes.object,
    i18n: PropTypes.object,
  }

  static childContextTypes = {
    file: PropTypes.object,
    i18n: PropTypes.object,
  }

  static propTypes = {
    file: PropTypes.object,
    i18n: PropTypes.object,
  }

  getChildContext() {
    return {
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

export default DefaultTemplate
