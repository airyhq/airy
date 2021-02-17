import React from 'react';
import styles from './index.module.scss';
import {Message} from 'httpclient';
import {DefaultMessageRenderingProps} from '..';

type RichTextRenderProps = DefaultMessageRenderingProps & {
  message: Message;
  text: string;
  fallback: string;
  containsRichText: boolean;
};

export const RichText = (props: RichTextRenderProps) => {
  const {message, text, fallback, containsRichText, fromContact} = props;
  return (
    <div className={styles.container} id={`message-item-${message.id}`}>
      {!fromContact ? (
        <div className={styles.member}>
          <div className={styles.memberText}>{containsRichText ? text : fallback}</div>
        </div>
      ) : (
        <div className={styles.userContainer}>
          <div className={styles.user}>
            <div className={styles.userText}>{containsRichText ? text : fallback}</div>
          </div>
        </div>
      )}
    </div>
  );
};
