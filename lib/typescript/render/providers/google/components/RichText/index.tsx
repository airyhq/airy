import React from 'react';
import ReactMarkdown from 'react-markdown';

import styles from './index.module.scss';

type RichTextRenderProps = {
  text: string;
  fromContact?: boolean;
  fallback: string;
  containsRichText: boolean;
};

export const RichText = (props: RichTextRenderProps) => {
  const {text, fromContact} = props;
  return (
    <div className={fromContact ? styles.contactContent : styles.memberContent}>
      <ReactMarkdown className={styles.richText} skipHtml={true} linkTarget={'_blank'}>
        {text}
      </ReactMarkdown>
    </div>
  );
};
