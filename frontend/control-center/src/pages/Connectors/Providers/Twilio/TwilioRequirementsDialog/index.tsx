import React from 'react';

import {SettingsModal} from 'components';
import {ReactComponent as CloseIcon} from 'assets/images/icons/close.svg';

import styles from './index.module.scss';
import {useTranslation} from 'react-i18next';

type TwilioRequirementsDialogProps = {
  onClose: () => void;
};

export const TwilioRequirementsDialog = (props: TwilioRequirementsDialogProps) => {
  const {t} = useTranslation();

  return (
    <SettingsModal style={{maxWidth: '582px'}} title={t('connectWhatsapp')} close={props.onClose}>
      <div className={styles.container}>
        <button className={styles.closeButton} onClick={props.onClose}>
          <CloseIcon />
        </button>
        <div className={styles.inviteWrapper}>
          <h1 className={styles.headline}>{t('connectWithTwilio')}</h1>
          <p className={styles.firstMessage}>
            {t('twilioConfigurationText')}{' '}
            <a
              href="https://support.twilio.com/hc/en-us/articles/223136027-Auth-Tokens-and-How-to-Change-Them"
              target="_blank"
              rel="noreferrer"
            >
              {t('twilioConfigurationText2')}
            </a>{' '}
            {t('twilioConfigurationText3')}{' '}
            <a
              className={styles.configMessage}
              href="https://airy.co/docs/core/getting-started/installation/configuration"
              target="_blank"
              rel="noreferrer"
            >
              {t('twilioConfigurationText4')}
            </a>{' '}
            {t('twilioConfigurationText5')}
          </p>

          <p className={styles.secondMessage}>{t('twilioConfigurationText6')}</p>

          <p className={styles.thirdMessage}>
            {t('twilioConfigurationText7')}{' '}
            <a href="https://docs.airy.co/" target="_blank" rel="noreferrer">
              {t('twilioConfigurationText8')}
            </a>{' '}
            {t('twilioConfigurationText9')}
          </p>
        </div>
      </div>
    </SettingsModal>
  );
};
