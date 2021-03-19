import React from 'react';
import {Contact} from 'httpclient';
import styles from './index.module.scss';
import {fallbackImage} from '../../services/fallbackImage';

type AvatarProps = {
  contact?: Contact;
};

export const Avatar = ({contact}: AvatarProps) => (
  <div className={styles.avatar}>
    <img
      alt={contact?.displayName || 'Unknown contact'}
      className={styles.avatarImage}
      src={contact?.avatarUrl}
      onError={(event: React.SyntheticEvent<HTMLImageElement, Event>) => fallbackImage(event, 'avatar')}
    />
  </div>
);
