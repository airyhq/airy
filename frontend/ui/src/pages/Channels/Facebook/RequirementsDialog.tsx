import React from 'react';
import styles from './RequirementsDialog.module.scss';
import close from 'assets/images/icons/close.svg';
import {Button, SettingsModal} from '@airyhq/components';

type RequirementsDialogProps = {
  onClose: () => void;
  onAddChannel: () => void;
};

export const RequirementsDialog = (props: RequirementsDialogProps) => {
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
          <div className={styles.button}>
            <Button styleVariant="normal" type="button" onClick={() => props.onAddChannel()}>
              I&apos;m ready to connect
            </Button>
          </div>
        </div>
      </div>
    </SettingsModal>
  );
};

export const SmsWhatsappDialogue = (props: RequirementsDialogProps) => {
  return (
    <SettingsModal style={{maxWidth: '582px'}} title="Connect Messenger" close={props.onClose}>
      <div className={styles.backgroundContainer}>
        <div className={styles.container}>
          <button className={styles.closeButton} onClick={props.onClose}>
            <img src={close} />
          </button>
          <div className={styles.inviteWrapper}>
            <h1 className={styles.headline}>Connect with Twilio First</h1>
            <p className={styles.firstMessage}>
              Before you connect a number for SMS or Whatsapp, you must add a{' '}
              <a
                href="https://support.twilio.com/hc/en-us/articles/223136027-Auth-Tokens-and-How-to-Change-Them"
                target="_blank"
                rel="noreferrer">
                Twilio Auth Token{' '}
              </a>
              to the{' '}
              <a
                className={styles.configMessage}
                href="https://github.com/airyhq/airy/blob/develop/docs/docs/api/endpoints/channels.md"
                target="_blank"
                rel="noreferrer">
                infrastructure/airy.conf{' '}
              </a>
              file.
            </p>

            <p className={styles.secondMessage}>After that, you have to buy a number.</p>

            <p className={styles.thirdMessage}>
              Check{' '}
              <a href="https://docs.airy.co/" target="_blank" rel="noreferrer">
                Airy&apos;s documentation{' '}
              </a>
              for more details.
            </p>
            <Button type="submit" styleVariant="normal" onClick={props.onAddChannel}>
              Ready to Connect
            </Button>
          </div>
        </div>
      </div>
    </SettingsModal>
  );
};
