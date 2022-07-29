import React, {CSSProperties} from 'react';
import Modal from 'react-modal';
import ModalHeader from './ModalHeader';

import styles from './style.module.scss';

type SettingsModalProps = {
  close: () => void;
  title?: string;
  children: any;
  wrapperClassName?: string;
  containerClassName?: string;
  Icon?: React.ReactElement | null;
  headerClassName?: string;
  style?: CSSProperties;
  dataCyCloseButton?: string;
};

export const SettingsModal = (props: SettingsModalProps) => {
  const {
    close,
    title,
    children,
    headerClassName,
    wrapperClassName,
    style,
    containerClassName,
    Icon,
    dataCyCloseButton,
  } = props;
  return (
    <Modal
      className={`${styles.content} ${wrapperClassName}`}
      ariaHideApp={false}
      overlayClassName={styles.overlay}
      contentLabel={title}
      isOpen={true}
      shouldCloseOnOverlayClick={true}
      onRequestClose={close}>
      <div className={containerClassName}>
        {Icon ? Icon : ''}
        <ModalHeader title={title ?? ''} close={close} style={style} headerClassName={headerClassName} />
        {children}
      </div>
    </Modal>
  );
};
