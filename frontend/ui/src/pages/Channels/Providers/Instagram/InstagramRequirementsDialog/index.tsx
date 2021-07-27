import React from 'react';

import {SettingsModal} from 'components';
import {ReactComponent as CloseIcon} from 'assets/images/icons/close.svg';

import styles from './index.module.scss';

type InstagramRequirementsDialogProps = {
  onClose: () => void;
};

export const InstagramRequirementsDialog = (props: InstagramRequirementsDialogProps) => {
  return (
    <SettingsModal style={{maxWidth: '582px'}} title="Connect Messenger" close={() => props.onClose()}>
      <div className={styles.backgroundContainer}>
        <div className={styles.container}>
          <button className={styles.closeButton} onClick={() => props.onClose()}>
            <CloseIcon />
          </button>
          <div className={styles.title}>
            <p>Connect Instagram</p>
          </div>
          <div className={styles.headline}>
            <p>The Instagram source requires the following configuration:</p>
          </div>
          <div className={styles.body}>
            <ul>
              <li>
                An app id and an app secret so that the platform can send messages back via your Instagram application
              </li>
              <li>A webhook integration so that the platform can ingest messages from your Instagram pages</li>
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
