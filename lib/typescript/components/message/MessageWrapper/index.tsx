import React, {ReactNode} from 'react';
import {ContactInfo, DeliveryState} from 'model';
import {MessageInfo} from '../MessageInfo';
import {MessageContainer} from './MessageContainer';
import {Avatar} from '../Avatar';
import styles from './index.module.scss';

interface MessageWrapperProps {
  lastInGroup: boolean;
  isChatPlugin: boolean;
  children: ReactNode;
  fromContact: boolean;
  deliveryState?: DeliveryState;
  messageId?: string;
  senderName?: string;
  sentAt?: string;
  contact?: ContactInfo;
  handleFailedMessage?: (resend: boolean, messageId: string) => void;
  messageReaction?: string;
  decoration?: ReactNode;
}

export const MessageWrapper = (props: MessageWrapperProps) => {
  const {
    deliveryState,
    senderName,
    messageId,
    fromContact,
    decoration,
    lastInGroup,
    isChatPlugin,
    children,
    sentAt,
    contact,
    handleFailedMessage,
    messageReaction,
  } = props;

  const isContact = isChatPlugin ? !fromContact : fromContact;

  //fix marginLeft?
  //style={false ? {marginLeft: '48px'} : {}}

  return (
    <>
      <div
        className={styles.messageWrapper}
        style={{marginLeft: !lastInGroup && !isChatPlugin && isContact ? '48px' : ''}}
      >
        {isContact && sentAt && lastInGroup && (
          <div className={styles.avatar}>
            <Avatar contact={contact} />
          </div>
        )}
        <div className={`${styles.container} ${isContact ? styles.contactContainer : styles.memberContainer}`}>
          <MessageContainer
            deliveryState={deliveryState}
            isContact={isContact}
            decoration={decoration}
            isChatPlugin={isChatPlugin}
            messageReaction={messageReaction}
          >
            {children}
          </MessageContainer>
        </div>
      </div>
      {handleFailedMessage && (
        <MessageInfo
          isContact={isContact}
          sentAt={sentAt}
          deliveryState={deliveryState}
          messageId={messageId}
          senderName={senderName}
          handleFailedMessage={handleFailedMessage}
        />
      )}
    </>
  );
};
