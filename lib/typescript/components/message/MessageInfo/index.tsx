import React from 'react';
import styles from './index.module.scss';
import {DeliveryState} from 'model';

interface MessageInfoProps {
  isContact: boolean;
  deliveryState: DeliveryState;
  messageId: string;
  sentAt: string;
  senderName: string;
  handleFailedMessage: (resend: boolean, messageId: string) => void;
}

const MessageFailed = ({messageId, handleFailedMessage}) => {
  return (
    <div className={styles.failedMessage}>
      <p>Failed to send!</p>
      <button className={styles.messageFailedButton} type="button" onClick={() => handleFailedMessage(true, messageId)}>
        Retry
      </button>
    </div>
  );
};

const MessageSuccessfull = ({sentAt, senderName, senderIdentity}) => {
  return (
    <>
      {sentAt && `${sentAt}`} {senderName && senderIdentity}
    </>
  );
};

export const MessageInfo = (props: MessageInfoProps) => {
  const {isContact, deliveryState, messageId, sentAt, senderName, handleFailedMessage} = props;
  const senderIdentity = sentAt ? ` - sent by ${senderName}` : `sent by ${senderName}`;

  return (
    <div className={`${styles.infoMessage} ${isContact ? styles.contact : styles.member}`}>
      <span>
        {deliveryState === DeliveryState.failed && isContact ? (
          <MessageFailed messageId={messageId} handleFailedMessage={handleFailedMessage} />
        ) : (
          <MessageSuccessfull sentAt={sentAt} senderName={senderName} senderIdentity={senderIdentity} />
        )}
      </span>
    </div>
  );
};
