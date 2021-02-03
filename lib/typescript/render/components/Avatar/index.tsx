import React from 'react';
import {Contact} from 'httpclient';
import styles from './index.module.scss';

type AvatarProps = {
  contact: Contact;
};

const fallbackAvatar = 'https://s3.amazonaws.com/assets.airy.co/unknown.png';

export const Avatar = ({contact}: AvatarProps) => (
  <div className={styles.avatar}>
    <img alt={contact.displayName} className={styles.avatarImage} src={contact.avatarUrl || fallbackAvatar} />
  </div>
);
