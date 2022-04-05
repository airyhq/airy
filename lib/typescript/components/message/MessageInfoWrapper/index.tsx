import React, {ReactNode} from 'react';
import {Avatar} from '../Avatar';
import {ContactInfo, DeliveryState} from 'model';
import styles from './index.module.scss';
import {ReactComponent as ErrorMessageIcon} from 'assets/images/icons/errorMessage.svg';
import {isEqual} from 'lodash-es';

type MessageInfoWrapperProps = {
  children?: ReactNode;
  lastInGroup?: boolean;
  isChatPlugin: boolean;
  fromContact?: boolean;
  contact?: ContactInfo;
  sentAt?: string;
  decoration?: ReactNode;
  senderName?: string;
  deliveryState?: string;
  messageId?: string;
  onResendFailedMessage?: (resend: boolean, messageId: string) => void;
};

const MessageInfoWrapperComponent = (props: MessageInfoWrapperProps) => {
  const {
    sentAt,
    contact,
    fromContact,
    children,
    lastInGroup,
    isChatPlugin,
    decoration,
    senderName,
    deliveryState,
    messageId,
    onResendFailedMessage,
  } = props;

  const isContact = isChatPlugin ? !fromContact : fromContact;
  const senderIdentity = sentAt ? ` - sent by ${senderName}` : `sent by ${senderName}`;

  const MessageFailed = () => {
    return (
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <p>Failed to send!</p>
        <button
          className={styles.messageFailedButton}
          type="button"
          onClick={() => onResendFailedMessage(true, messageId)}
        >
          Retry
        </button>
      </div>
    );
  };

  const MessageSuccessfull = () => {
    return (
      <>
        {sentAt && `${sentAt}`} {senderName && senderIdentity}
      </>
    );
  };

  const MessageInfo = () => (
    <span className={styles.infoMessage}>
      {deliveryState === DeliveryState.failed ? <MessageFailed /> : <MessageSuccessfull />}
    </span>
  );

  const MemberMessage = () => (
    <div className={styles.member}>
      <div className={styles.errorFailedMessageContainer}>
        {deliveryState === DeliveryState.failed && (
          <ErrorMessageIcon className={styles.failedMessageIcon} height={24} width={24} />
        )}
        <div className={styles.memberContent}>{children}</div>
      </div>
    </div>
  );

  const ContactMessage = () => (
    <>
      <div className={styles.contact}>
        <div className={styles.contactContent}>{children}</div>
        {decoration}
      </div>
    </>
  );

  return <>{isContact ? <ContactMessage /> : <MemberMessage />}</>;
};

const arePropsEqual = (prevProps, nextProps) => {
  if (prevProps.messageId === nextProps.messageId) return true;

  return isEqual(prevProps, nextProps);
};

const MessageInfoWrapper = React.memo(MessageInfoWrapperComponent, arePropsEqual);

export {MessageInfoWrapper};
