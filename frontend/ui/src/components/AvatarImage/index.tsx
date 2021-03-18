import React from 'react';

import {Contact} from 'httpclient';
import styles from './index.module.scss';

const fallbackAvatar = 'https://s3.amazonaws.com/assets.airy.co/unknown.png';

type AvatarProps = {
  contact: Contact;
};

const AvatarImage = (props: AvatarProps) => {
  const {contact} = props;

  return (
    <div className={styles.avatar}>
      <img className={styles.avatarImage} src={(contact && contact.avatarUrl) || fallbackAvatar} />
    </div>
  );
};

export default AvatarImage;
