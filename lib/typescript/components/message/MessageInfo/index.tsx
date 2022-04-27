import React from 'react';
import styles from './index.module.scss';
import {DeliveryState} from 'model';

interface MessageInfoProps {
  isContact: boolean;
  deliveryState: DeliveryState;
  messageId: string;
  sentAt: string;
  senderName: string;
  handleFailedMessage: (messageId: string) => void;
  setFailedMessageResent: React.Dispatch<React.SetStateAction<boolean>>;
  failedMessageResent: boolean;
}

const MessageFailed = ({messageId, handleFailedMessage, setFailedMessageResent}) => {
  const resendMessage = async () => {
    setFailedMessageResent(true);
    handleFailedMessage(messageId);
    setTimeout(() => {
      setFailedMessageResent(false);
    }, 2000);
  };

  return (
    <div className={styles.failedMessage}>
      <p>Failed to send!</p>
      <button className={styles.messageFailedButton} type="button" onClick={resendMessage}>
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
  const {
    isContact,
    deliveryState,
    messageId,
    sentAt,
    senderName,
    handleFailedMessage,
    setFailedMessageResent,
    failedMessageResent,
  } = props;
  const senderIdentity = sentAt ? ` - sent by ${senderName}` : `sent by ${senderName}`;

  return (
    <div className={`${styles.infoMessage} ${isContact ? styles.contact : styles.member}`}>
      <span>
        {deliveryState === DeliveryState.failed && !failedMessageResent ? (
          <MessageFailed
            messageId={messageId}
            handleFailedMessage={handleFailedMessage}
            setFailedMessageResent={setFailedMessageResent}
          />
        ) : (
          !failedMessageResent && (
            <MessageSuccessfull sentAt={sentAt} senderName={senderName} senderIdentity={senderIdentity} />
          )
        )}
      </span>
    </div>
  );
};
