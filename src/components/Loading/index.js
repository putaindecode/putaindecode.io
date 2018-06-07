import React, { Component } from "react";
import TopBarProgressIndicator from "react-topbar-progress-indicator";

import styles from "./styles.css";

TopBarProgressIndicator.config({
  barColors: {
    "0": "#fff",
    "1.0": "#fff",
  },
  shadowBlur: 5,
});

const Loading = () => (
  <div>
    <TopBarProgressIndicator />
    <div className={styles.loader}>
      <div className={styles.spinner} />
    </div>
  </div>
);

export default Loading;
