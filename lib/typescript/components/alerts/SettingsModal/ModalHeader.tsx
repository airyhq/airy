import React from 'react';
import styles from './ModalHeader.module.scss';
import {ReactComponent as CloseIcon} from 'assets/images/icons/close.svg';

type ModalHeaderProps = {
  title: string;
  close: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const ModalHeader = ({title, close}: ModalHeaderProps) => {
  return (
    <div className={styles.modalHeader}>
      <button className={styles.closeButton} onClick={close}>
        <CloseIcon className={styles.closeIcon} title="Close" />
      </button>
      <div className={styles.headline}>{title}</div>
    </div>
  );
};

export default ModalHeader;
