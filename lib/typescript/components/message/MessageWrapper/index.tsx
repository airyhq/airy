import React, {ReactNode} from 'react';
import {MessageContainer} from './MessageContainer';
import {MessageInfo} from '../MessageInfo';
import {Avatar} from '../Avatar';
import styles from './index.module.scss';
import {Source, ContactInfo, Message} from 'model';
import {CommandUnion} from 'render';

interface MessageWrapperProps {
  message: Message;
  source: Source;
  decoration?: ReactNode;
  lastInGroup: boolean;
  sentAt?: string;
  isChatPlugin: boolean;
  contact?: ContactInfo;
  handleFailedMessage?: (resend: boolean, messageId: string) => void;
  contentType: 'message' | 'template' | 'suggestedReplies' | 'quickReplies';
  invertSides?: boolean;
  commandCallback?: (command: CommandUnion) => void;
}

export const MessageWrapper = (props: MessageWrapperProps) => {
  const {
    message,
    source,
    decoration,
    lastInGroup,
    sentAt,
    isChatPlugin,
    contact,
    handleFailedMessage,
    contentType,
    invertSides,
    commandCallback,
  } = props;

  const isContact = isChatPlugin ? !message.fromContact : message.fromContact;

  return (
    <>
      <div
        className={styles.wrapper}
        style={{marginLeft: lastInGroup === false && isChatPlugin === false ? '48px' : ''}}
      >
        {isContact && sentAt && lastInGroup && (
          <div className={styles.avatar}>
            <Avatar contact={contact} />
          </div>
        )}
        <div className={`${styles.container} ${isContact ? styles.contactContainer : styles.memberContainer}`}>
          <MessageContainer
            message={message}
            source={source}
            isChatPlugin={isChatPlugin}
            contentType={contentType}
            invertSides={invertSides}
            commandCallback={commandCallback}
            isContact={isContact}
            decoration={decoration}
          />
        </div>
      </div>
      <MessageInfo
        isContact={isContact}
        sentAt={sentAt}
        deliveryState={message.deliveryState}
        messageId={message.id}
        senderName={message?.sender?.name}
        handleFailedMessage={handleFailedMessage}
      />
    </>
  );
};
