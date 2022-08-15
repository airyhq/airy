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
  styleHeader?: CSSProperties;
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
    styleHeader,
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
      onRequestClose={close}
      style={style}
    >
      <div className={containerClassName}>
        {Icon ? Icon : ''}
        <ModalHeader
          title={title ?? ''}
          close={close}
          style={styleHeader}
          headerClassName={headerClassName}
          dataCyCloseButton={dataCyCloseButton}
        />
        {children}
      </div>
    </Modal>
  );
};
