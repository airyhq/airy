import React from 'react';
import styles from './index.module.scss';
import {Avatar} from '../Avatar';
import {Message} from 'httpclient';
import {DefaultMessageRenderingProps} from '..';

type RichTextRenderProps = DefaultMessageRenderingProps & {
  message: Message;
  text: string;
  fallback: string;
  containsRichText: boolean;
};

export const RichText = (props: RichTextRenderProps) => {
  const {message, text, fallback, containsRichText, fromContact, sentAt, contact} = props;

  return (
    <div className={styles.messageContainer} id={`message-item-${message.id}`}>
      {!fromContact ? (
        <div className={styles.messageMember}>
          <div className={styles.messageMemberText}>{containsRichText ? text : fallback}</div>
          {sentAt && <div className={styles.messageTime}>{sentAt}</div>}
        </div>
      ) : (
        <div className={styles.messageUserContainer}>
          <div className={styles.messageAvatar}>{contact && <Avatar contact={contact} />}</div>
          <div className={styles.messageUser}>
            <div className={styles.messageUserText}>{containsRichText ? text : fallback}</div>
            {sentAt && <div className={styles.messageTime}>{sentAt}</div>}
          </div>
        </div>
      )}
    </div>
  );
};
