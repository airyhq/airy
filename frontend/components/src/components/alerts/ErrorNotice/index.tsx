import React from "react";
import {ReactComponent as ExclamationIcon} from "../../../assets/images/icons/exclamation.svg";

import styles from "./style.module.scss";

type ErrorNoticeProps = {
    /** Color theme for the error notice */
    theme: "warning" | "error";
    /** Error text */
    children: React.ReactNode;
};

const ErrorNoticeComponent = ({children, theme}: ErrorNoticeProps) => (
    <div className={`${styles.container} ${styles[theme]}`}>
        <div className={styles.iconWrapper}>
            <ExclamationIcon aria-hidden="true"/>
        </div>
        {children}
    </div>
);

export const ErrorNotice = ErrorNoticeComponent;
