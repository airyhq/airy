import React from 'react';

import {SettingsModal} from 'components';
import {ReactComponent as CloseIcon} from 'assets/images/icons/close.svg';

import styles from './index.module.scss';
import {useTranslation} from 'react-i18next';

type InstagramRequirementsDialogProps = {
  onClose: () => void;
};

export const InstagramRequirementsDialog = (props: InstagramRequirementsDialogProps) => {
  const {t} = useTranslation();

  return (
    <SettingsModal style={{maxWidth: '582px'}} title={t('connectInstagram')} close={() => props.onClose()}>
      <div className={styles.backgroundContainer}>
        <div className={styles.container}>
          <button className={styles.closeButton} onClick={() => props.onClose()}>
            <CloseIcon />
          </button>
          <div className={styles.title}>
            <p>{t('connectInstagram')}</p>
          </div>
          <div className={styles.headline}>
            <p>{t('instagramConfigurationText')}</p>
          </div>
          <div className={styles.body}>
            <ul>
              <li>{t('instagramConfigurationText2')}</li>
              <li>{t('instagramConfigurationText3')}</li>
              <li>{t('instagramConfigurationText4')}</li>
            </ul>
            <p>
              <a href="https://docs.airy.co/" target="_blank" rel="noreferrer">
                {t('instagramConfigurationText5')}
              </a>{' '}
              {t('instagramConfigurationText6')}
            </p>
          </div>
        </div>
      </div>
    </SettingsModal>
  );
};
