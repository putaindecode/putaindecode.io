import React, { PropTypes } from "react"

const Html = ({ children }) => (
  <html lang="fr" className="r-VerticalRhythm">
    {children}
  </html>
)

Html.propTypes = {
  children: PropTypes.array.isRequired,
}

export default Html
