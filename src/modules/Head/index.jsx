import React, {Component} from "react"

class Head extends Component {
  static displayName = "Head"

  render() {
    return (
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=Edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimal-ui"
        />
        <title>{this.props.title}</title>
        <link
          rel="stylesheet"
          href="/index.css"
        />
        <link
          rel="alternate"
          href="/feed.xml"
          title="{this.props.title}"
          type="application/atom+xml"
        />
        {this.props.children}
      </head>
    )
  }
}

export default Head
