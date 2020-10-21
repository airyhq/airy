import React from "react";
import { ReactComponent as WarningIcon } from "../../../assets/images/icons/exclamation-triangle.svg";
import picture from "../../../assets/images/pictures/fogg-waiting.png";
import logoUrl from "../../../assets/images/logo/airy_primary_rgb.svg";
import styles from "./style.module.scss";
import _, { WithTranslation, withTranslation } from "react-i18next";

type ErrorMessageProps = {
  text?: string;
} & WithTranslation;

const ErrorMessageComponent = ({ t, text }: ErrorMessageProps) => {
  return (
    <>
      <div className={styles.headerError}>
        <img src={logoUrl} alt="Airy Logo" width={128} />
        <div className={styles.errorContainer}>
          <WarningIcon />
          <p>{text || t("alerts.linkExpired")}</p>
        </div>
      </div>
      <img src={picture} className={styles.errorImage} alt="Airy Waiting" />
    </>
  );
};

export const ErrorMessage = withTranslation()(ErrorMessageComponent);
