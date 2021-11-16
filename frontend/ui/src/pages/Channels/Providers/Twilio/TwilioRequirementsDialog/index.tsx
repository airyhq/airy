import React from 'react';

import {SettingsModal} from 'components';
import {ReactComponent as CloseIcon} from 'assets/images/icons/close.svg';

import styles from './index.module.scss';

type TwilioRequirementsDialogProps = {
  onClose: () => void;
};

export const TwilioRequirementsDialog = (props: TwilioRequirementsDialogProps) => {
  return (
    <SettingsModal style={{maxWidth: '582px'}} title="Connect Messenger" close={props.onClose}>
      <div className={styles.container}>
        <button className={styles.closeButton} onClick={props.onClose}>
          <CloseIcon />
        </button>
        <div className={styles.inviteWrapper}>
          <h1 className={styles.headline}>Connect with Twilio First</h1>
          <p className={styles.firstMessage}>
            Before you connect a number for SMS or Whatsapp, you must add a{' '}
            <a
              href="https://support.twilio.com/hc/en-us/articles/223136027-Auth-Tokens-and-How-to-Change-Them"
              target="_blank"
              rel="noreferrer"
            >
              Twilio Auth Token
            </a>{' '}
            to the{' '}
            <a
              className={styles.configMessage}
              href="https://airy.co/docs/core/getting-started/installation/configuration"
              target="_blank"
              rel="noreferrer"
            >
              airy.yaml
            </a>{' '}
            file.
          </p>

          <p className={styles.secondMessage}>After that, you have to buy a number.</p>

          <p className={styles.thirdMessage}>
            Check{' '}
            <a href="https://docs.airy.co/" target="_blank" rel="noreferrer">
              Airy&apos;s documentation
            </a>{' '}
            for more details.
          </p>
        </div>
      </div>
    </SettingsModal>
  );
};
