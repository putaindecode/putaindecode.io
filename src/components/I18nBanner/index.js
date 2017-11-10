import React from "react";
import { PropTypes } from "react";

import Button from "../Button";
import SVGInline from "react-svg-inline";

import classes from "./styles.css";
import crossSVG from "./cross.svg";

const Component = props => (
  <div className={classes.component}>
    {props.labels.invite}
    <Button small onClick={() => props.onAccept()}>
      {props.labels.yes}
    </Button>
    <Button small onClick={() => props.onHideForever()}>
      {props.labels.hide}
    </Button>
    <Button small onClick={() => props.onHideForever()}>
      {props.labels.hide2}
    </Button>
    <span
      className={classes.close}
      aria-role={"button "}
      onClick={() => props.onHide()}
    >
      <SVGInline className={"putainde-Icon"} svg={crossSVG} cleanup />
    </span>
  </div>
);

Component.propTypes = {
  labels: PropTypes.object.isRequired,
  onAccept: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  onHideForever: PropTypes.func.isRequired
};

Component.displayName = "I18nBanner";

export default Component;
