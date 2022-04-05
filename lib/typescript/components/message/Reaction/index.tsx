import React from 'react';
import {Message} from 'model';

import styles from './index.module.scss';
import {Emoji} from '../../general/Emoji';

type Props = {
  message: Message;
  isContact: boolean;
};

export const Reaction = ({message, isContact}: Props) => {
  const emoji = message.metadata?.reaction?.emoji;
  //'❤️';

  if (!emoji) {
    return null;
  }
  return (
    <div className={`${styles.wrapper} ${isContact ? styles.alignRight : styles.alignLeft}`}>
      <Emoji className={styles.emojiWrapper} symbol={emoji} />
    </div>
  );
};
