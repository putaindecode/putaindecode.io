import React, {Component} from "react"

export default class Analytics extends Component {

  render() {
    return (
      <script
        dangerouslySetInnerHTML={{__html:
    `var _gaq=[["_setAccount","UA-43771806-1"],["_trackPageview"]];` +
    `(function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];` +
    `g.src="//www.google-analytics.com/ga.js";` +
    `s.parentNode.insertBefore(g,s)}(document,"script"));`,
        }}
      ></script>
    )
  }
}
