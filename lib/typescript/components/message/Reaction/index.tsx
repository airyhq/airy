import React from 'react';
import styles from './index.module.scss';
import {Emoji} from '../../general/Emoji';

type Props = {
  messageReaction: string;
  isContact: boolean;
};

export const Reaction = ({messageReaction, isContact}: Props) => {
  if (!messageReaction) {
    return null;
  }

  return (
    <div className={`${styles.wrapper} ${isContact ? styles.alignRight : styles.alignLeft}`}>
      <Emoji className={styles.emojiWrapper} symbol={messageReaction} />
    </div>
  );
};
