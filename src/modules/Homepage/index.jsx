import React from "react"

import DefaultTemplate from "../DefaultTemplate"
import Html from "../Html"
import Head from "../Head"
import Body from "../Body"

class Homepage extends DefaultTemplate {
  render() {
    return (
      <Html>
        <Head />
        <Body>
          <div className="putainde-Section putainde-Section--manifesto">
            <div className="r-Grid r-Grid--alignCenter">
              <div className="r-Grid-cell r-all--8of12 putainde-Section-contents putainde-Post-contents">
                <div
                  dangerouslySetInnerHTML={{__html: this.props.file.contents}}
                />
              </div>
            </div>
          </div>
        </Body>
      </Html>
    )
  }
}

export default Homepage
