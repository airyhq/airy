import React from 'react';

import {SettingsModal} from 'components';
import {ReactComponent as CloseIcon} from 'assets/images/icons/close.svg';

import styles from './index.module.scss';
import {useTranslation} from 'react-i18next';

type FacebookMessengerRequirementsDialogProps = {
  onClose: () => void;
};

export const FacebookMessengerRequirementsDialog = (props: FacebookMessengerRequirementsDialogProps) => {
  const {t} = useTranslation();
  return (
    <SettingsModal style={{maxWidth: '582px'}} title="Connect Messenger" close={() => props.onClose()}>
      <div className={styles.backgroundContainer}>
        <div className={styles.container}>
          <button className={styles.closeButton} onClick={() => props.onClose()}>
            <CloseIcon />
          </button>
          <div className={styles.title}>
            <p>{t('connectMessenger')}</p>
          </div>
          <div className={styles.headline}>
            <p>{t('facebookConfiguration')}</p>
          </div>
          <div className={styles.body}>
            <ul>
              <li>{t('facebookConfigurationText')}</li>
              <li>{t('facebookConfigurationText2')}</li>
              <li>{t('facebookConfigurationText3')}</li>
            </ul>
            <p>
              <a href="https://docs.airy.co/" target="_blank" rel="noreferrer">
                {t('facebookConfigurationText4')}
              </a>{' '}
              {t('facebookConfigurationText5')}
            </p>
          </div>
        </div>
      </div>
    </SettingsModal>
  );
};
