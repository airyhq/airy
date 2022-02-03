import React from 'react';
import {ReactComponent as WarningIcon} from 'assets/images/icons/exclamationTriangle.svg';
import picture from 'assets/images/pictures/fogg-waiting.png';
import logoUrl from 'assets/images/logo/airyPrimaryRgb.svg';
import styles from './style.module.scss';

type ErrorMessageProps = {
  text?: string;
};

const ErrorMessageComponent = ({text}: ErrorMessageProps) => {
  return (
    <>
      <div className={styles.headerError}>
        <img src={logoUrl} alt="Airy Logo" width={128} />
        <div className={styles.errorContainer}>
          <WarningIcon />
          <p>{text}</p>
        </div>
      </div>
      <img src={picture} className={styles.errorImage} alt="Airy Waiting" />
    </>
  );
};

export const ErrorMessage = ErrorMessageComponent;
