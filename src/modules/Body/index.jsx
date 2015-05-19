import React, {Component, PropTypes} from "react"

import Header from "../Header"
import Footer from "../Footer"
import Analytics from "../Analytics"
import Disqus from "../Disqus"

export default class Body extends Component {

  static displayName = "Body"

  static defaultProps = {
    scripts: [],
  }

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
    scripts: PropTypes.array,
  }

  render() {
    return (
      <body>

        <Header />

        <div className="putainde-Main">
          {this.props.children}
        </div>

        <Footer />

        {
          this.props.scripts.map(script => (
            <script key={script} src={script}></script>
          ))
        }

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
