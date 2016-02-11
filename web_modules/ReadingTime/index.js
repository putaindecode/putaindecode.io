import React, { Component, PropTypes } from "react"
import cx from "classnames"

class ReadingTime extends Component {
  constructor(props) {
    super(props)
    const words = this.props.text
      .trim()
      // trip html tags
      .replace(/<\/?[^>]+(>|$)/g, "")
      // split by words
      .split(/\s+|\s*\.\s*/)
    this.state = {
      minutes: Math.ceil(words.length / this.props.wordsPerMinute),
    }
  }

  replaceParameters(string) {
    return string
      .replace("${minutes}", this.state.minutes)
      .replace("${wordsPerMinute}", this.props.wordsPerMinute)
  }

  render() {
    return (
      <span
        className={cx(
          `r-Tooltip`,
          `r-Tooltip--${this.props.tooltipPosition}`,
          this.props.className,
        )}
        data-r-tooltip={this.replaceParameters(this.props.templateTooltip)}
      >
        {this.props.before}
        {
          this.state.minutes === 1 &&
          this.replaceParameters(this.props.templateText[1])
        }
        {
          this.state.minutes > 1 &&
          this.replaceParameters(this.props.templateText[2])
        }
        {this.props.after}
      </span>
    )
  }
}

ReadingTime.propTypes = {
  text: PropTypes.string.isRequired,
  before: PropTypes.string,
  templateText: PropTypes.object,
  after: PropTypes.string,
  templateTooltip: PropTypes.string,
  className: PropTypes.string,
  wordsPerMinute: PropTypes.number,
  tooltipPosition: PropTypes.oneOf([
    "top",
    "bottom",
    "left",
    "right",
  ]),
}

ReadingTime.defaultProps = {
  // http://www.slate.fr/lien/57193/adulte-300-mots-minute
  // http://www.combiendemots.com/mot-par-minute
  // 250 seems cool
  wordsPerMinute: 250,
  templateText: {
    1: "less than a minute",
    2: "around ${minutes} minutes",
  },
  templateTooltip:
  "Approxiate time, based on a speed of ${wordsPerMinute} words per minute",
  tooltipPosition: "top",
}

export default ReadingTime
