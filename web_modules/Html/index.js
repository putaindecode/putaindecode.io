import React, { Component, PropTypes } from "react"

const Html = ({ children }) => (
  <html lang="fr" className="r-VerticalRhythm">
    {this.props.children}
  </html>
)

Html.propTypes = {
  children: PropTypes.array.isRequired,
}

export default Html
