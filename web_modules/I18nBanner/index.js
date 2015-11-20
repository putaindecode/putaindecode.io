import React from "react"
import { PropTypes } from "react"

import Button from "Button"

import classes from "./styles.css"

const Component = (props) => (
  <div className={ classes.component }>
    { props.labels.invite }
    <Button
      small
      onClick={ () => props.onAccept() }
    >
      { props.labels.yes }
    </Button>
    <Button
      small
      onClick={ () => props.onHide() }
    >
      { props.labels.hide }
    </Button>
    <Button
      small
      onClick={ () => props.onHideForever() }
    >
      { props.labels.hideForever }
    </Button>
  </div>
)

Component.propTypes = {
  labels: PropTypes.object.isRequired,
  onAccept: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  onHideForever: PropTypes.func.isRequired,
}

Component.displayName = "I18nBanner"

export default Component
