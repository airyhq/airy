import React from 'react';
import {MessageContainer} from './MessageContainer';
import {MessageInfo} from '../MessageInfo';
import {Avatar} from '../Avatar';
import styles from './index.module.scss';
import {Source} from 'model';

interface MessageWrapperProps {
  message: any;
  source: Source;
  messageDecoration?: any;
  lastInGroup: boolean;
  sentAt?: string;
  isChatPlugin: boolean;
  contact?: any;
  handleFailedMessage?: any;
  contentType: 'message' | 'template' | 'suggestedReplies' | 'quickReplies';
  invertSides?: any;
  commandCallback?: any;
}

export const MessageWrapper = (props: MessageWrapperProps) => {
  const {
    message,
    source,
    messageDecoration,
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
            isContact={isContact}
            messageDecoration={messageDecoration}
            isChatPlugin={isChatPlugin}
            contentType={contentType}
            invertSides={invertSides}
            commandCallback={commandCallback}
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
