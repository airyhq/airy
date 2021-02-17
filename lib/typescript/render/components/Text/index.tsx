import React from 'react';
import styles from './index.module.scss';
import {DefaultMessageRenderingProps} from '../index';

type TextRenderProps = DefaultMessageRenderingProps & {
  text: string;
};

export const Text = ({fromContact, text}: TextRenderProps) => (
  <div className={styles.wrapper}>
    <div className={styles.messageListItem}>
      {!fromContact ? (
        <div className={styles.messageListItemMember}>
          <div className={styles.messageListItemMemberText}>{text}</div>
        </div>
      ) : (
        <div className={styles.messageListUserContainer}>
          <div className={styles.messageListItemUser}>
            <div className={styles.messageListItemUserText}>{text}</div>
          </div>
        </div>
      )}
    </div>
  </div>
);
