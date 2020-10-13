import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

import { AccessibleSVG } from "../../labels/AccessibleSVG";

import styles from "./ModalHeader.module.scss";
import closeIcon from "../../../assets/images/icons/close.svg";

type ModalHeaderProps = {
  title: string;
  close: (event: any) => void;
};

const ModalHeader = ({
  t,
  title,
  close
}: ModalHeaderProps & WithTranslation) => {
  return (
    <div className={styles.modalHeader}>
      <button className={styles.closeButton} onClick={close}>
        <AccessibleSVG
          src={closeIcon}
          className={styles.closeIcon}
          title={t("common.close")}
        />
      </button>
      <div className={styles.headline}>{title}</div>
    </div>
  );
};

export default withTranslation()(ModalHeader);
