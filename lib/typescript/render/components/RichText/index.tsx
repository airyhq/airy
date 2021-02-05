import React from 'react';
import styles from './index.module.scss';
import {Avatar} from '../Avatar';
import {Message, SenderType} from 'httpclient';
import {isFromContact} from 'httpclient';
import {DefaultMessageRenderingProps} from '..';

type RichTextRenderProps = DefaultMessageRenderingProps & {
  message: Message;
};

export const RichText = (props: RichTextRenderProps) => {
  const {message, conversation, sentAt, showAvatar} = props;
  const messageJSON = JSON.parse(message.content);
  const messageText = messageJSON.text;
  const messageFallback = messageJSON.fallback;
  const messageIsRichText = messageJSON.containsRichText;
  const isAppUser = message.senderType == SenderType.appUser;

  return (
    <div className={styles.messageListItemContainer}>
      <div className={styles.messageListItem} id={`message-item-${message.id}`}>
        {isAppUser ? (
          <div className={styles.messageListItemMember}>
            <div className={styles.messageListItemMemberText}>{messageIsRichText ? messageText : messageFallback}</div>
            {sentAt && <div className={styles.messageTime}>{sentAt}</div>}
          </div>
        ) : (
          <div className={styles.messageListUserContainer}>
            <div className={styles.messageAvatar}>{showAvatar && <Avatar contact={conversation.contact} />} </div>
            <div className={styles.messageListItemUser}>
              <div className={styles.messageListItemUserText}>{messageIsRichText ? messageText : messageFallback}</div>
              {sentAt && <div className={styles.messageTime}>{sentAt}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
