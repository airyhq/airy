import React from 'react';
import {ReactSVG} from 'react-svg';
import warningIcon from '../../../assets/images/icons/exclamation-triangle.svg';
import picture from '../../../assets/images/pictures/fogg-waiting.png';
import logo from '../../../assets/images/logo/airy_primary_rgb.svg';
import styles from './style.module.scss';
import {WithTranslation, withTranslation} from 'react-i18next';

type ErrorMessageProps = {
  text?: string;
} & WithTranslation

const ErrorMessageComponent = ({t, text}: ErrorMessageProps) => {
  return (
    <>
      <div className={styles.headerError}>
        <img src={logo} alt="Airy Logo" width={128} />
        <div className={styles.errorContainer}>
          <ReactSVG src={warningIcon} />
          <p>{text || t('alerts.linkExpired')}</p>
        </div>
      </div>
      <img src={picture} className={styles.errorImage} alt="Airy Waiting" />
    </>
  );
};

export const ErrorMessage = withTranslation()(ErrorMessageComponent);
