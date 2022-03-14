import React, {ReactNode} from 'react';
import {Avatar} from '../Avatar';
import {Contact, DeliveryState} from 'model';
import styles from './index.module.scss';
import {ReactComponent as ErrorMessageIcon} from 'assets/images/icons/errorMessage.svg';

type MessageInfoWrapperProps = {
  children: ReactNode;
  lastInGroup?: boolean;
  isChatPlugin: boolean;
  fromContact?: boolean;
  contact?: Contact;
  sentAt?: string;
  decoration?: ReactNode;
  senderName?: string;
  deliveryState?: string;
  messageId?: string;
  onResendFailedMessage?: (resend: boolean, messageId: string) => void;
};

export const MessageInfoWrapper = (props: MessageInfoWrapperProps) => {
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
        {deliveryState === DeliveryState.failed && <ErrorMessageIcon height={24} width={24} />}
        <div className={styles.memberContent}>{children}</div>
      </div>
      <MessageInfo />
    </div>
  );

  const ContactMessage = () => (
    <>
      <div className={styles.contact}>
        {sentAt && (
          <div className={styles.avatar}>
            <Avatar contact={contact} />
          </div>
        )}
        <div
          className={styles.contactContent}
          style={lastInGroup === false && isChatPlugin === false ? {marginLeft: '48px'} : {}}
        >
          {children}
        </div>
        {decoration}
      </div>
      <MessageInfo />
    </>
  );

  return <>{isContact ? <ContactMessage /> : <MemberMessage />}</>;
};
