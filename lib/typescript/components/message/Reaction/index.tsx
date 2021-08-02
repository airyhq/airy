import React from 'react';
import {Message} from 'model';

import styles from './index.module.scss';
import {Emoji} from '../../general/Emoji';

type Props = {
  message: Message;
};

export const Reaction = ({message}: Props) => {
  const emoji = message.metadata.reaction?.emoji;
  if (!emoji) {
    return null;
  }
  return (
    <div className={styles.wrapper}>
      <Emoji className={styles.emojiWrapper} symbol={emoji} />
    </div>
  );
};
