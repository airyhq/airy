import React from 'react';
import styles from './index.module.scss';
import {Avatar} from '../Avatar';
import {DefaultMessageRenderingProps} from '../index';

type TextRenderProps = DefaultMessageRenderingProps & {
  text: string;
};

export const Text = ({contact, sentAt, fromContact, text}: TextRenderProps) => (
  <div className={styles.wrapper}>
    <div className={styles.messageListItem}>
      {!fromContact ? (
        <div className={styles.messageListItemMember}>
          <div className={styles.messageListItemMemberText}>{text}</div>
          {sentAt && <div className={styles.messageTime}>{sentAt}</div>}
        </div>
      ) : (
        <div className={styles.messageListUserContainer}>
          <div className={styles.messageAvatar}>{contact && <Avatar contact={contact} />}</div>
          <div className={styles.messageListItemUser}>
            <div className={styles.messageListItemUserText}>{text}</div>
            {sentAt && <div className={styles.messageTime}>{sentAt}</div>}
          </div>
        </div>
      )}
    </div>
  </div>
);
