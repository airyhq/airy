import React from 'react';
import ReactMarkdown from 'react-markdown';

import {Message} from 'model';

import styles from './index.module.scss';

type RichTextRenderProps = {
  message: Message;
  text: string;
  fromContact: boolean;
  fallback: string;
  containsRichText: boolean;
};

export const RichText = (props: RichTextRenderProps) => {
  const {message, text, fromContact} = props;
  return (
    <div className={fromContact ? styles.contactContent : styles.memberContent} id={`message-item-${message.id}`}>
      <ReactMarkdown className={styles.richText} skipHtml={true} linkTarget={'_blank'}>
        {text}
      </ReactMarkdown>
    </div>
  );
};
