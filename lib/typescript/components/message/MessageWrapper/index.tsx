import React, {ReactNode} from 'react';
import {Source, ContactInfo, Message} from 'model';
import {CommandUnion, ContentType} from 'render';
import {MessageContainer} from './MessageContainer';
import {MessageInfo} from '../MessageInfo';
import {Avatar} from '../Avatar';
import styles from './index.module.scss';

interface MessageWrapperProps {
  message: Message;
  contentType: ContentType;
  source: Source;
  lastInGroup: boolean;
  sentAt?: string;
  decoration?: ReactNode;
  contact?: ContactInfo;
  handleFailedMessage?: (resend: boolean, messageId: string) => void;
  invertSides?: boolean;
  commandCallback?: (command: CommandUnion) => void;
}

export const MessageWrapper = (props: MessageWrapperProps) => {
  const {
    message,
    contentType,
    source,
    lastInGroup,
    sentAt,
    decoration,
    contact,
    handleFailedMessage,
    invertSides,
    commandCallback,
  } = props;

  const isChatPlugin = invertSides && commandCallback;

  const isContact = isChatPlugin ? !message.fromContact : message.fromContact;

  return (
    <>
      <div className={styles.messageWrapper} style={{marginLeft: !lastInGroup && !isChatPlugin ? '48px' : ''}}>
        {isContact && sentAt && lastInGroup && (
          <div className={styles.avatar}>
            <Avatar contact={contact} />
          </div>
        )}
        <div className={`${styles.container} ${isContact ? styles.contactContainer : styles.memberContainer}`}>
          <MessageContainer
            message={message}
            source={source}
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
