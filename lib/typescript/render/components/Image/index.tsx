import React from 'react';
import styles from './index.module.scss';
import {Avatar} from '../Avatar';
import {DefaultMessageRenderingProps} from '../index';

type ImageRenderProps = DefaultMessageRenderingProps & {
  imageUrl: string;
};

export const Image = ({contact, sentAt, fromContact, imageUrl}: ImageRenderProps) => (
  <div className={styles.wrapper}>
    <div className={styles.messageListItem}>
      {!fromContact ? (
        <div className={styles.messageListItemMember}>
          <div className={styles.messageListItemMemberImage}>
            <img className={styles.messageListItemImageBlock} src={imageUrl} />
          </div>
          {sentAt && <div className={styles.messageTime}>{sentAt}</div>}
        </div>
      ) : (
        <div className={styles.messageListUserContainer}>
          <div className={styles.messageAvatar}>
            <Avatar contact={contact} />
          </div>
          <div className={styles.messageListItemUser}>
            <div className={styles.messageListItemUserImage}>
              <img className={styles.messageListItemImageBlock} src={imageUrl} />
            </div>
            {sentAt && <div className={styles.messageTime}>{sentAt}</div>}
          </div>
        </div>
      )}
    </div>
  </div>
);
