import React from 'react';
import Modal from 'react-modal';
import ModalHeader from './ModalHeader';

import styles from './style.module.scss';

export const SettingsModal = ({close, title, children, style}) => {
  return (
    <Modal
      className={styles.content}
      ariaHideApp={false}
      overlayClassName={styles.overlay}
      contentLabel={title}
      isOpen={true}
      shouldCloseOnOverlayClick={true}
      onRequestClose={close}
    >
      <div style={style}>
        <ModalHeader title={title} close={close} />

        <div className={styles.container}>{children}</div>
      </div>
    </Modal>
  );
};
