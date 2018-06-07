import React from "react";
import cx from "classnames";
import { PropTypes } from "react";

import classes from "./styles.css";

const Component = props => {
  const { small, block, ...otherProps } = props;
  return (
    <button
      {...otherProps}
      className={cx({
        [classes.component]: true,
        [classes.componentBlock]: block,
        [classes.componentSmall]: small,
      })}
    >
      {props.children}
    </button>
  );
};

Component.propTypes = {
  children: PropTypes.node,
  block: PropTypes.bool,
  small: PropTypes.bool,
};

Component.displayName = "Button";

export default Component;
