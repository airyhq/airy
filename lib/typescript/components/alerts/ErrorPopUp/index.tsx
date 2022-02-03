import React from 'react';

import {ReactComponent as WarningIcon} from 'assets/images/icons/exclamationTriangle.svg';
import {ReactComponent as CloseIcon} from 'assets/images/icons/close.svg';
import styles from './style.module.scss';

export const ErrorPopUp = (props: errorPopUpProps) => {
  const {message, closeHandler} = props;

  return (
    <div className={styles.main}>
      <div className={styles.errorWrapper}>
        <div className={styles.errorContainer}>
          <WarningIcon />
          <p>{message}</p>
          <button onClick={() => closeHandler()}>
            <CloseIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

type errorPopUpProps = {
  message: string;
  closeHandler(): void;
};
