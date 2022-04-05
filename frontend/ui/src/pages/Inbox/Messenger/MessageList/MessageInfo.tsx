import React from 'react';
import styles from './index.module.scss';
import {resendMessage} from '../../../../actions/messages';
import {DeliveryState} from 'model';

const handleFailedMessage = (resend: boolean, messageId: string) => {
  resend && resendMessage({messageId});
};

const MessageFailed = ({messageId}) => {
  return (
    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
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

export const MessageInfo = ({isContact, deliveryState, messageId, sentAt, senderName}) => {
  const senderIdentity = sentAt ? ` - sent by ${senderName}` : `sent by ${senderName}`;

  return (
    <div className={`${styles.infoMessage} ${isContact ? styles.contact : styles.member}`}>
      <span>
        {deliveryState === DeliveryState.failed ? (
          <MessageFailed messageId={messageId} />
        ) : (
          <MessageSuccessfull sentAt={sentAt} senderName={senderName} senderIdentity={senderIdentity} />
        )}
      </span>
    </div>
  );
};
