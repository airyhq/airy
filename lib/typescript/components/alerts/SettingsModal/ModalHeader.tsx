import React, {CSSProperties} from 'react';
import styles from './ModalHeader.module.scss';
import {ReactComponent as CloseIcon} from 'assets/images/icons/close.svg';

type ModalHeaderProps = {
  title: string;
  close: (event: React.MouseEvent<HTMLButtonElement>) => void;
  headerClassName: string;
  style: CSSProperties;
};

const ModalHeader = ({title, close, headerClassName, style}: ModalHeaderProps) => {
  return (
    <div className={styles.modalHeader}>
      <button className={styles.closeButton} onClick={close}>
        <CloseIcon className={styles.closeIcon} title="Close" />
      </button>
      <div style={style} className={`${styles.headline} ${headerClassName}`}>
        {title}
      </div>
    </div>
  );
};

export default ModalHeader;
