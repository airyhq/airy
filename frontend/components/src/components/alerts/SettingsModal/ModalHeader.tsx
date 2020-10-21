import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

import styles from "./ModalHeader.module.scss";
import { ReactComponent as CloseIcon } from "../../../assets/images/icons/close.svg";

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
        <CloseIcon className={styles.closeIcon} title={t("common.close")} />
      </button>
      <div className={styles.headline}>{title}</div>
    </div>
  );
};

export default withTranslation()(ModalHeader);
