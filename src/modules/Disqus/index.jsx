import React, {Component, PropTypes} from "react"

export default class Disqus extends Component {

  static displayName = "Disqus"

  static propTypes = {
    baseURL: PropTypes.string.isRequired,
    pageName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    comments: PropTypes.bool,
    developer: PropTypes.bool,
  }

  render() {
    const html = []
    html.push(`var disqus_shortname = "${this.props.id}"`)
    if (this.props.developer) {
      html.push("var disqus_developer = 1")
    }
    if (this.props.comments) {
      html.push(`var disqus_identifier = "${this.props.baseURL}/${this.props.pageName}"`)
      html.push(`var disqus_url = "${this.props.baseURL}/${this.props.pageName}"`)
      html.push(`var disqus_script = "embed.js"`)
    }
    else {
      html.push(`var disqus_script = "count.js"`)
    }
    html.push(`
(function(d,s) {
  s = d.createElement('script');s.async=1;s.src = '//' + disqus_shortname + '.disqus.com/'+disqus_script;
  (d.getElementsByTagName('head')[0]).appendChild(s)
})(document)
    `)

    return (
      <script dangerouslySetInnerHTML={{__html: html.join(";\n")}}></script>
    )
  }
}
