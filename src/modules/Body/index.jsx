import React, {Component, PropTypes} from "react"

import Header from "../Header"
import Footer from "../Footer"
import Analytics from "../Analytics"
import Disqus from "../Disqus"

export default class Body extends Component {

  static displayName = "Body"

  static contextTypes = {
    pkg: PropTypes.object.isRequired,
    file: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired,
  }

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]).isRequired,
  }

  render() {
    const LR_URL =
      `http://${__SERVER_HOSTNAME__}:${__LR_SERVER_PORT__}/` +
      `livereload.js`
    return (
      <body>

        <Header />

        <div className="putainde-Main">
          {this.props.children}
        </div>

        <Footer />

        <script src={`/index.${__VERSION__}.js`}></script>
        { __DEV__ && <script src={LR_URL}></script> }

        <Analytics />

        <Disqus
          baseURL={this.context.pkg.homepage}
          url={this.context.file.url}
          comments={this.context.file.comments}
          {...this.context.i18n.disqus}
        />

      </body>
    )
  }
}
