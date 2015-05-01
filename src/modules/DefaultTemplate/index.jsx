import React, {Component, PropTypes} from "react"

import Html from "../Html"
import Head from "../Head"
import Body from "../Body"

export default class DefaultTemplate extends Component {

  static displayName = "DefaultTemplate"

  static propTypes = {
    pkg: PropTypes.object.isRequired,
    contributors: PropTypes.object.isRequired,
    collections: PropTypes.object.isRequired,
    file: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired,
  }

  static childContextTypes = {
    pkg: PropTypes.object.isRequired,
    contributors: PropTypes.object.isRequired,
    collections: PropTypes.object.isRequired,
    file: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired,
  }

  getChildContext() {
    return {
      pkg: this.props.pkg,
      contributors: this.props.contributors,
      collections: this.props.collections,
      file: this.props.file,
      i18n: this.props.i18n,
    }
  }

  render() {
    if (!this.props.file.title) {
      console.log(`${this.props.file.filename} doesn't have a title`)
    }
    return (
      <Html>
        <Head title={this.props.file.title} />
        <Body>
          <article className="r-Grid putainde-Post">
            <div className="r-Grid-cell r-all--8of12 putainde-Post-contents">

              {
                this.props.file.title &&
                <div className="putainde-Title">
                  <h1 className="putainde-Title-text">
                    {this.props.file.title}
                  </h1>
                </div>
              }

              <div className="putainde-Post-md"
                dangerouslySetInnerHTML={{__html: this.props.file.contents}}
              />

            </div>
          </article>
        </Body>
      </Html>
    )
  }
}
