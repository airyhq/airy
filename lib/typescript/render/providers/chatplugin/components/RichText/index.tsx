import React from 'react';
import ReactMarkdown from 'react-markdown';

import styles from './index.module.scss';

type RichTextRenderProps = {
  text: string;
  fromContact: boolean;
  fallback: string;
  containsRichText: boolean;
  customFont?: string;
};

export const RichText = (props: RichTextRenderProps) => {
  const {text, fromContact, customFont} = props;
  return (
    <div className={fromContact ? styles.contactContent : styles.memberContent} style={{fontFamily: customFont}}>
      <ReactMarkdown className={styles.richText} skipHtml={true} linkTarget={'_blank'}>
        {text}
      </ReactMarkdown>
    </div>
  );
};
