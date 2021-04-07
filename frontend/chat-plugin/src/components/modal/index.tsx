import React from 'react';
import styles from './index.module.scss';
import {ReactComponent as CloseIcon} from 'assets/images/icons/close.svg';

type ModalDialogueProps = {
  close: () => void;
  children: JSX.Element;
};

export const ModalDialogue = ({close, children}: ModalDialogueProps) => {
  return (
    <div className={styles.background}>
      <div className={styles.dialog}>
        <div className={styles.dialogInner}>
          <button onClick={close} className={styles.closeButton}>
            <CloseIcon title="Close dialog" />
          </button>
          <div className={styles.inviteWrapper}>
            <h3 className={styles.headline}>Are you sure you want to end this chat?</h3>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
