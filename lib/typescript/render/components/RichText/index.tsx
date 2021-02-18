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
    <div className={fromContact ? styles.contactContent : styles.memberContent} id={`message-item-${message.id}`}>
      {containsRichText ? text : fallback}
    </div>
  );
};
