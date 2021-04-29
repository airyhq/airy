import React, {SyntheticEvent} from 'react';
import {Contact} from 'model';
import styles from './index.module.scss';

type AvatarProps = {
  contact?: Contact;
};

const fallbackAvatar = 'https://s3.amazonaws.com/assets.airy.co/unknown.png';

const fallbackAvatarImage = (event: SyntheticEvent<HTMLImageElement, Event>) => {
  event.currentTarget.src = fallbackAvatar;
  event.currentTarget.alt = 'fallback avatar';
};

export const Avatar = ({contact}: AvatarProps) => (
  <img
    alt={contact?.displayName || 'Unknown contact'}
    className={styles.avatarImage}
    src={contact?.avatarUrl || fallbackAvatar}
    onError={(event: React.SyntheticEvent<HTMLImageElement, Event>) => fallbackAvatarImage(event)}
  />
);
