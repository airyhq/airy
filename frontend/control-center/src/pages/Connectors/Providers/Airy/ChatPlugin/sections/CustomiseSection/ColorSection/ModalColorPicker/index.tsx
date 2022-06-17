import {ListenOutsideClick} from 'components';
import React, {Dispatch, SetStateAction} from 'react';
import Modal from 'react-modal';
import {SketchPicker} from 'react-color';
import styles from './index.module.scss';

type ModalColorPickerProps = {
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
  toggle: () => void;
};

export const ModalColorPicker = (props: ModalColorPickerProps) => {
  const {color, setColor, toggle} = props;

  return (
    <Modal
      className={styles.content}
      ariaHideApp={false}
      overlayClassName={styles.overlay}
      isOpen={true}
      shouldCloseOnOverlayClick={true}
      onRequestClose={close}
    >
      <ListenOutsideClick className={styles.colorPickerWrapper} onOuterClick={toggle}>
        <SketchPicker
          color={color}
          onChangeComplete={(color: {hex: string}) => {
            setColor(color.hex.toUpperCase());
          }}
        />
      </ListenOutsideClick>
    </Modal>
  );
};
