import React from 'react';
import styles from './index.module.scss';
import {Avatar} from '../Avatar';
import {SharedComponentProps} from '../../shared';

type TextRenderProps = SharedComponentProps & {
  text: string;
};

export const Text = ({conversation, showAvatar, sentAt, fromContact, text}: TextRenderProps) => (
  <div className={styles.wrapper}>
    <div className={styles.messageListItem}>
      {!fromContact ? (
        <div className={styles.messageListItemMember}>
          <div className={styles.messageListItemMemberText}>{text}</div>
          {sentAt && <div className={styles.messageTime}>{sentAt}</div>}
        </div>
      ) : (
        <div className={styles.messageListUserContainer}>
          <div className={styles.messageAvatar}>{showAvatar && <Avatar contact={conversation.contact} />}</div>
          <div className={styles.messageListItemUser}>
            <div className={styles.messageListItemUserText}>{text}</div>
            {sentAt && <div className={styles.messageTime}>{sentAt}</div>}
          </div>
        </div>
      )}
    </div>
  </div>
);
