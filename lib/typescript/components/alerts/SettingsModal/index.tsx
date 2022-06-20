import React, {CSSProperties} from 'react';
import Modal from 'react-modal';
import ModalHeader from './ModalHeader';

import styles from './style.module.scss';

type SettingsModalProps = {
  close: () => void;
  title: string;
  children: any;
  style?: CSSProperties;
  wrapperClassName?: string;
  containerClassName?: string;
};

export const SettingsModal = (props: SettingsModalProps) => {
  const {close, title, children, style, wrapperClassName, containerClassName} = props;
  return (
    <Modal
      className={`${styles.content} ${wrapperClassName}`}
      ariaHideApp={false}
      overlayClassName={styles.overlay}
      contentLabel={title}
      isOpen={true}
      shouldCloseOnOverlayClick={true}
      onRequestClose={close}
    >
      <div style={style} className={containerClassName}>
        <ModalHeader title={title} close={close} style={style} />
        {children}
      </div>
    </Modal>
  );
};
