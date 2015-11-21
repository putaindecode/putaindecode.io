import React from "react"
import cx from "classnames"
import { PropTypes } from "react"

import classes from "./styles.css"

const Component = (props) => (
  <button
    { ...props }
    className={cx({
      [classes.component]: true,
      [classes.componentBlock]: props.block,
      [classes.componentSmall]: props.small,
    })}
  >
    { props.children }
  </button>
)

Component.propTypes = {
  children: PropTypes.node,
  block: PropTypes.bool,
  small: PropTypes.bool,
}

Component.displayName = "Button"

export default Component
