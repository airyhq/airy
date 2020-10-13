import React from "react";

import styles from "./style.module.scss";

export const SimpleLoader = (props: any) => (
  <div className={`${props.isWhite ? styles.loaderWhite : styles.loader}`}>
    <div />
    <div />
    <div />
    <div />
  </div>
);
