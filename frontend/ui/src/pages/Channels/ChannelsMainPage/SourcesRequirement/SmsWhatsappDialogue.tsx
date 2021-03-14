import React from 'react';
import styles from './SmsWhatsappDialogue.module.scss';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import {Button} from '@airyhq/components';
import {ReactComponent as CloseIcon} from 'assets/images/icons/close.svg';

type SmsWhatsappDialogueProps = {
  close: () => void;
  callModal?: () => void;
};

const SmsWhatsappDialogue = (props: SmsWhatsappDialogueProps & RouteComponentProps) => {
  return (
    <div className={styles.background}>
      <div className={styles.dialog}>
        <div className={styles.dialogInner}>
          <button onClick={props.close} className={styles.closeButton}>
            <CloseIcon title="Close dialog" />
          </button>

          <div className={styles.inviteWrapper}>
            <h1 className={styles.headline}>Connect with Twillo First</h1>
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
                href="https://github.com/airyhq/airy/blob/develop/docs/docs/api/endpoints/channels.md"
                target="_blank"
                rel="noreferrer">
                infrastructure/airy.conf field.{' '}
              </a>
            </p>

            <p className={styles.secondMessage}>After that, you have to buy a number.</p>

            <p className={styles.thirdMessage}>
              Check{' '}
              <a href="https://docs.airy.co/" target="_blank" rel="noreferrer">
                Airy&apos;s documentation{' '}
              </a>
              for more details.
            </p>
            <Button type="submit" styleVariant="normal" onClick={props.callModal}>
              Ready to Connect
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default withRouter(SmsWhatsappDialogue);
