import React from 'react';
import {ReactSVG} from 'react-svg';

import warningIcon from '../../../assets/images/icons/exclamation-triangle.svg';
import closeIcon from '../../../assets/images/icons/close.svg';
import styles from './style.module.scss';

export const ErrorPopUp = (props: errorPopUpProps) => {
  const {message, closeHandler} = props;

  return (
    <div className={styles.main}>
      <div className={styles.errorContainer}>
        <ReactSVG src={warningIcon} />
        <p>{message}</p>
        <button onClick={() => closeHandler()}>
          <ReactSVG src={closeIcon} />
        </button>
      </div>
    </div>
  );
};

type errorPopUpProps = {
  message: string;
  closeHandler(): void;
};
