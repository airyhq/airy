import React from 'react';

import {SettingsModal} from 'components';
import {ReactComponent as CloseIcon} from 'assets/images/icons/close.svg';

import styles from './index.module.scss';

type GoogleBusinessMessagesRequirementsDialogProps = {
  onClose: () => void;
};

export const GoogleBusinessMessagesRequirementsDialog = (props: GoogleBusinessMessagesRequirementsDialogProps) => {
  return (
    <SettingsModal style={{maxWidth: '582px'}} title="Connect Google's Business Messages" close={() => props.onClose()}>
      <div className={styles.backgroundContainer}>
        <div className={styles.container}>
          <button className={styles.closeButton} onClick={() => props.onClose()}>
            <CloseIcon />
          </button>
          <div className={styles.title}>
            <p>Connect Google&apos;s Business Messages</p>
          </div>
          <div className={styles.headline}>
            <p>
              Google&apos;s Business Messages source requires the following configuration to send messages to your Airy
              Core instance:
            </p>
          </div>
          <div className={styles.body}>
            <ul>
              <li>A Google Service Account Key</li>
              <li>A Google Partner Key</li>
            </ul>
            <p>
              <a href="https://airy.co/docs/core/sources/google" target="_blank" rel="noreferrer">
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
