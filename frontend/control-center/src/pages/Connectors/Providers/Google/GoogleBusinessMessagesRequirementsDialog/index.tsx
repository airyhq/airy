import React from 'react';

import {SettingsModal} from 'components';
import {ReactComponent as CloseIcon} from 'assets/images/icons/close.svg';

import styles from './index.module.scss';
import {t} from 'i18next';

type GoogleBusinessMessagesRequirementsDialogProps = {
  onClose: () => void;
};

export const GoogleBusinessMessagesRequirementsDialog = (props: GoogleBusinessMessagesRequirementsDialogProps) => {
  return (
    <SettingsModal style={{maxWidth: '582px'}} title={t('connectGoogle')} close={() => props.onClose()}>
      <div className={styles.backgroundContainer}>
        <div className={styles.container}>
          <button className={styles.closeButton} onClick={() => props.onClose()}>
            <CloseIcon />
          </button>
          <div className={styles.title}>
            <p>{t('connectGoogle')}</p>
          </div>
          <div className={styles.headline}>
            <p>{t('googleConfigurationText')}</p>
          </div>
          <div className={styles.body}>
            <ul>
              <li>{t('googleAccountKey')}</li>
              <li>{t('googleKey')}</li>
            </ul>
            <p>
              <a href="https://airy.co/docs/core/sources/google" target="_blank" rel="noreferrer">
                {t('googleConfigurationText2')}
              </a>{' '}
              {t('googleConfigurationText3')}
            </p>
          </div>
        </div>
      </div>
    </SettingsModal>
  );
};
