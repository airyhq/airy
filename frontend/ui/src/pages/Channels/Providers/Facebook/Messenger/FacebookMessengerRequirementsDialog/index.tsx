import React from 'react';

import {SettingsModal} from 'components';
import close from 'assets/images/icons/close.svg';

import styles from './index.module.scss';

type FacebookMessengerRequirementsDialogProps = {
  onClose: () => void;
};

export const FacebookMessengerRequirementsDialog = (props: FacebookMessengerRequirementsDialogProps) => {
  return (
    <SettingsModal style={{maxWidth: '582px'}} title="Connect Messenger" close={() => props.onClose()}>
      <div className={styles.backgroundContainer}>
        <div className={styles.container}>
          <button className={styles.closeButton} onClick={() => props.onClose()}>
            <img src={close} />
          </button>
          <div className={styles.title}>
            <p>Connect Messenger</p>
          </div>
          <div className={styles.headline}>
            <p>The Facebook source requires the following configuration:</p>
          </div>
          <div className={styles.body}>
            <ul>
              <li>
                An app id and an app secret so that the platform can send messages back via your Facebook application
              </li>
              <li>A webhook integration so that the platform can ingest messages from your Facebook pages</li>
              <li>A page token for each facebook page you intend to integrate</li>
            </ul>
            <p>
              <a href="https://docs.airy.co/" target="_blank" rel="noreferrer">
                Check Airy&apos;s Documentation
              </a>{' '}
              for more information.
            </p>
          </div>
        </div>
      </div>
    </SettingsModal>
  );
};
