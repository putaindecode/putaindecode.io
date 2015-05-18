import React, {PropTypes} from "react"

import DefaultTemplate from "../Default"

import Html from "../../modules/Html"
import Head from "../../modules/Head"
import Body from "../../modules/Body"

export default class Page404 extends DefaultTemplate {

  static displayName = "Page404"

  // should not be declared here too, only in parent class
  // https://github.com/yannickcr/eslint-plugin-react/issues/68
  static propTypes = {
    metadata: PropTypes.object.isRequired,
    contributors: PropTypes.object.isRequired,
    collections: PropTypes.object.isRequired,
    file: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired,
  }

  render() {
    return (
      <Html>
        <Head
          title={this.props.file.title}
          stylesheets={this.props.metadata.assets.stylesheets}
        />
        <Body
          scripts={this.props.metadata.assets.scripts}
        >
          <div className="r-Grid putainde-Post">
            <div className="r-Grid-cell r-all--8of12">
              <div
                className="putainde-Post-contents"
                style={{textAlign: "center"}}
              >
                {
                  this.props.file.title &&
                  <div className="putainde-Title">
                    <h1 className="putainde-Title-text">
                      {this.props.file.title}
                    </h1>
                  </div>
                }

                <div
                  style={{margin: "8rem 0 12rem"}}
                  dangerouslySetInnerHTML={{__html: this.props.file.contents}}
                >
                </div>

              </div>
            </div>
          </div>
        </Body>
      </Html>
    )
  }
}
