import React from "react";
import { AccessibleSVG } from "../../labels/AccessibleSVG";
import exclamationIcon from "../../../assets/images/icons/exclamation.svg";

import styles from "./style.module.scss";

type ErrorNoticeProps = {
  /** Color theme for the error notice */
  theme: "warning" | "error";
  /** Error text */
  children: React.ReactNode;
};

const ErrorNoticeComponent = ({ children, theme }: ErrorNoticeProps) => (
  <div className={`${styles.container} ${styles[theme]}`}>
    <div className={styles.iconWrapper}>
      <AccessibleSVG ariaHidden="true" src={exclamationIcon} />
    </div>
    {children}
  </div>
);

export const ErrorNotice = ErrorNoticeComponent;
